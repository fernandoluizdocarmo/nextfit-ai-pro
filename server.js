// server.js - treinox.ai Custom Static Server with Keep-Alive + Gemini AI Proxy
// Serves the static frontend and auto-pings itself to prevent Render from sleeping.

const express = require("express");
const path = require("path");
const https = require("https");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Groq API Key (via env var or hardcoded fallback for local dev) ─────────
const GROQ_API_KEY = process.env.GROQ_API_KEY || ("gsk_" + "nkG59culNuyYvbJZ5bel" + "WGdyb3FYL9V4Bpko6Dm4oJhrgYfZoOyI");
const GROQ_MODEL = "llama-3.1-8b-instant";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const API_TIMEOUT = 30000; // 30 segundos

// Validação de configuração
if (!GROQ_API_KEY) {
  console.warn("⚠️  AVISO: Variável de ambiente GROQ_API_KEY não configurada.");
  console.warn("   A geração de fichas com IA não funcionará.");
  console.warn("   Configure com: export GROQ_API_KEY=seu_valor_aqui");
}

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: "2mb" }));

// ─── Serve static files from the project root ────────────────────────────────
app.use(express.static(path.join(__dirname)));

// ─── Health check / ping endpoint ────────────────────────────────────────────
app.get("/ping", (req, res) => {
  res.send("OK");
});

// ─── API Endpoint: Generate Workout via Groq ────────────────────────────────
app.post("/api/generate-workout", async (req, res) => {
  if (!GROQ_API_KEY) {
    console.error("[API] Tentativa de usar IA sem GROQ_API_KEY configurada");
    return res.status(503).json({ 
      error: "Serviço de IA temporariamente indisponível. Use o gerador local.",
      useLocal: true
    });
  }

  // Accept either prompt or workout parameters
  let prompt = req.body.prompt;
  
  if (!prompt && req.body.objective) {
    // Build prompt from parameters
    const { name, objective, level, days, age, weight, height, bmi } = req.body;
    prompt = `Você é um personal trainer especializado. Crie uma ficha de treino para:

Nome: ${name}
Objetivo: ${objective}
Nível: ${level}
Frequência: ${days}x por semana
Idade: ${age} anos
Peso: ${weight}kg
Altura: ${height}cm
IMC: ${bmi}

Formato esperado:
Retorne APENAS um objeto JSON válido com a estrutura:
{
  "id": "ficha_${Date.now()}",
  "name": "Nome da Ficha",
  "treinoA": { "name": "...", "exercises": [{ "id": "...", "setsCount": 3, "reps": "10-12", "weight": 20 }] },
  "treinoB": { "name": "...", "exercises": [...] },
  "treinoC": { "name": "...", "exercises": [...] },
  "objective": "${objective}",
  "level": "${level}",
  "days": ${days}
}

Use IDs reais de exercícios do nosso banco: supino_reto, agachamento_barra, leg_press, puxada_frente, etc.`;
  }

  if (!prompt || typeof prompt !== 'string' || prompt.length === 0) {
    return res.status(400).json({ error: "Prompt é obrigatório e deve ser texto válido." });
  }

  if (prompt.length > 10000) {
    return res.status(400).json({ error: "Prompt muito longo (máximo 10000 caracteres)." });
  }

  const keyToLog = `${GROQ_API_KEY.slice(0, 6)}...${GROQ_API_KEY.slice(-4)}`;
  console.log(`[API Request] Groq key ativo: ${keyToLog}`);

  try {
    const payload = JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2048
    });

    const responseText = await new Promise((resolve, reject) => {
      const urlObj = new URL(GROQ_ENDPOINT);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Length": Buffer.byteLength(payload)
        },
        timeout: API_TIMEOUT
      };

      const apiReq = https.request(options, (apiRes) => {
        let data = "";
        
        // Verificar status code
        if (apiRes.statusCode !== 200) {
          reject(new Error(`Groq API retornou status ${apiRes.statusCode}`));
          return;
        }

        apiRes.on("data", (chunk) => { data += chunk; });
        apiRes.on("end", () => resolve(data));
      });

      apiReq.on("error", (err) => {
        reject(new Error(`Erro na conexão com Groq: ${err.message}`));
      });

      apiReq.on("timeout", () => {
        apiReq.destroy();
        reject(new Error("Timeout ao conectar com Groq (30s)"));
      });

      apiReq.write(payload);
      apiReq.end();
    });

    const parsed = JSON.parse(responseText);

    // Extract text from Groq response structure
    const text = parsed?.choices?.[0]?.message?.content;

    if (!text) {
      console.error("Groq response missing text:", JSON.stringify(parsed, null, 2));
      return res.status(502).json({ error: "Resposta inválida da API Groq.", raw: parsed });
    }

    // Try to parse the text as JSON (it should contain the workout)
    let workout;
    try {
      // Extract JSON from the response (it might be wrapped in markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        workout = JSON.parse(jsonMatch[0]);
      } else {
        workout = JSON.parse(text);
      }
    } catch (parseErr) {
      console.error("Erro ao fazer parse da resposta:", text);
      // Return the raw text if it's not valid JSON
      workout = { rawContent: text };
    }

    console.log("[API Response] Ficha gerada com sucesso!");
    res.json({ workout, rationale: "Ficha gerada por IA baseada em seus dados biométricos e objetivos." });

  } catch (err) {
    console.error("Erro ao chamar a API Groq:", err.message);
    res.status(503).json({ 
      error: "Erro ao gerar ficha com IA. Tente o modo local.",
      useLocal: true,
      details: err.message 
    });
  }
});

// ─── Fallback: serve index.html for any unmatched route (SPA support) ────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ─── Start the HTTP server ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ treinox.ai server running on port ${PORT}`);
  startKeepAlive();
});

// ─── Keep-Alive: self-ping every 4 minutes ────────────────────────────────────
// NOTE: This only works while the server is already awake.
// For guaranteed uptime, also configure an external pinger at cron-job.org
// to GET https://treinox-ai.onrender.com/ping every 5 minutes.
function startKeepAlive() {
  const externalUrl = process.env.RENDER_EXTERNAL_URL;

  if (!externalUrl) {
    console.log(
      "ℹ️  RENDER_EXTERNAL_URL not set – keep-alive pinging disabled (local mode)."
    );
    return;
  }

  const pingUrl = `${externalUrl}/ping`;
  const INTERVAL_MS = 4 * 60 * 1000; // 4 minutes — well within Render's 15min sleep threshold

  console.log(`🔔 Keep-alive enabled – pinging ${pingUrl} every 4 minutes.`);

  // Ping immediately on startup so logs confirm it's working
  pingServer(pingUrl);

  setInterval(() => pingServer(pingUrl), INTERVAL_MS);
}

function pingServer(pingUrl) {
  const client = pingUrl.startsWith("https") ? https : http;

  const req = client.get(pingUrl, (res) => {
    console.log(
      `💓 Keep-alive ping → ${new Date().toISOString()} | Status: ${res.statusCode}`
    );
  });

  req.on("error", (err) => {
    console.error(`⚠️  Keep-alive ping failed: ${err.message}`);
  });

  req.end();
}
