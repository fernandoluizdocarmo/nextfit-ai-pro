// server.js - treinox.ai Custom Static Server with Keep-Alive + Gemini AI Proxy
// Serves the static frontend and auto-pings itself to prevent Render from sleeping.

const express = require("express");
const path = require("path");
const https = require("https");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Groq API Key (via env var or hardcoded fallback for local dev) ─────────
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = "mixtral-8x7b-32768";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

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
    return res.status(500).json({ error: "API Key do Groq não está configurada no servidor (Variável de ambiente GROQ_API_KEY ausente)." });
  }

  const { prompt } = req.body;

  const keyToLog = GROQ_API_KEY 
    ? `${GROQ_API_KEY.slice(0, 6)}...${GROQ_API_KEY.slice(-4)}`
    : "undefined";
  console.log(`[API Request] Using Groq key: ${keyToLog}`);

  if (!prompt) {
    return res.status(400).json({ error: "Prompt é obrigatório." });
  }

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: "Chave da API Groq não configurada no servidor." });
  }

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
      max_tokens: 2048,
      response_format: { type: "json_object" }
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
        }
      };

      const apiReq = https.request(options, (apiRes) => {
        let data = "";
        apiRes.on("data", (chunk) => { data += chunk; });
        apiRes.on("end", () => resolve(data));
      });

      apiReq.on("error", reject);
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

    res.json({ text });

  } catch (err) {
    console.error("Erro ao chamar a API Groq:", err.message);
    res.status(500).json({ error: "Erro interno ao chamar a IA. " + err.message });
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
