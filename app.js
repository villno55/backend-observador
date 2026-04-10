import express from "express";
import cors from "cors";
import observacionesRoutes from "./routes/observaciones.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/observaciones", observacionesRoutes);

export default app;
