const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const client = require("prom-client");


const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "users-service OK" }));
app.use("/", authRoutes);

// Métricas por defecto
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();
// Endpoint /metrics
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app;