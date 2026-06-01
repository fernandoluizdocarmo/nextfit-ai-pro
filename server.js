// server.js - treinox.ai Custom Static Server with Keep-Alive
// Serves the static frontend and auto-pings itself to prevent Render from sleeping.

const express = require("express");
const path = require("path");
const https = require("https");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Serve static files from the project root ────────────────────────────────
app.use(express.static(path.join(__dirname)));

// Health check / ping endpoint
app.get("/ping", (req, res) => {
  res.send("OK");
});

// Fallback: serve index.html for any unmatched route (SPA support)
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
