import { Router } from "express";
import {
  getUsers,
  getUserById,
  deleteUser,
} from "../controllers/user.controller.js";
import { mongoIdValidator } from "../middlewares/validators.js";
import { validateFields } from "../middlewares/validateFields.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas exclusivas para admin
router.get("/", authMiddleware, adminMiddleware, getUsers);
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  mongoIdValidator,
  validateFields,
  getUserById,
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  mongoIdValidator,
  validateFields,
  deleteUser,
);

export default router;
