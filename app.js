import express from "express";
import cors from "cors";
import observacionesRoutes from "./routes/observaciones.routes.js";
import aprendicesRoutes from "./routes/aprendices.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/observaciones", observacionesRoutes);
app.use("/api/aprendices", aprendicesRoutes);
export default app;
