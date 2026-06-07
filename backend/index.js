require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const recetasRoutes = require("./routes/recetas");
const comentariosRoutes = require("./routes/comentarios");
const healthRoutes = require("./routes/health");

if (process.env.NODE_ENV !== "test") {
  connectDB();
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/recetas", recetasRoutes);
app.use("/api/comentarios", comentariosRoutes);
app.use("/api", healthRoutes);

app.use(errorHandler);

let server = null;
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 4000;
  server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
  });
}

module.exports = { app, server };
