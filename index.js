import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db.js";

// Carga las variables de entorno (.env)
dotenv.config();

const app = express();

// Middlewares iniciales
app.use(express.json()); // Para procesar JSON en req.body
app.use(cors()); // Para permitir peticiones desde el cliente
app.use(cookieParser()); // Para leer cookies en req.cookies

// Conexión a la base de datos
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
