import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../middlewares/validators.js";
import { validateFields } from "../middlewares/validateFields.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas
router.post("/register", registerValidator, validateFields, register);
router.post("/login", loginValidator, validateFields, login);

// Rutas privadas (requieren cookie con JWT válido)
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/logout", authMiddleware, logout);

export default router;
