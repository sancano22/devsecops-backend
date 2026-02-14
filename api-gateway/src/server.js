require("dotenv").config();
const express = require("express");
const client = require("prom-client");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;
const ACADEMIC_SERVICE_URL = process.env.ACADEMIC_SERVICE_URL;

app.use(cors());
// se descomento para kubernetes
//app.use(express.json());

// Health check (DevSecOps)
app.get("/health", (_req, res) => {
  res.json({ status: "api-gateway OK" });
});

// Métricas por defecto
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Endpoint /metrics
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// AUTH → users-service
app.use(
  "/auth",
  createProxyMiddleware({
    target: USERS_SERVICE_URL,
    changeOrigin: true,
  })
);

// COURSES → academic-service
app.use(
  "/courses",
  createProxyMiddleware({
    target: ACADEMIC_SERVICE_URL,
    changeOrigin: true,
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT,"0.0.0.0", () => {
  console.log(`🌐 API Gateway running on port ${PORT}`);
});