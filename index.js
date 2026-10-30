import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db.js";

// Importación de rutas
import authRoutes from "./src/routes/auth.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import eventRoutes from "./src/routes/event.routes.js";
import userRoutes from "./src/routes/user.routes.js";

dotenv.config();

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Conexión a MongoDB
connectDB();

// Registro de rutas
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
