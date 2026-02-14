// src/app.js
const express = require("express");
const cors = require("cors");
const client = require("prom-client");
const coursesRoutes = require("./routes/courses.routes");

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Health check (útil para DevSecOps / Docker)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "academic-service OK" });
});

// Métricas por defecto
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();
// Endpoint /metrics
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Rutas del dominio académico
app.use("/", coursesRoutes);

module.exports = app;