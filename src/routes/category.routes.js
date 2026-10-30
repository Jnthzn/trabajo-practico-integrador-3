import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import {
  categoryValidator,
  mongoIdValidator,
} from "../middlewares/validators.js";
import { validateFields } from "../middlewares/validateFields.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas para usuarios autenticados
router.get("/", authMiddleware, getCategories);
router.get(
  "/:id",
  authMiddleware,
  mongoIdValidator,
  validateFields,
  getCategoryById,
);

// Rutas exclusivas para admin
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  categoryValidator,
  validateFields,
  createCategory,
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  mongoIdValidator,
  categoryValidator,
  validateFields,
  updateCategory,
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  mongoIdValidator,
  validateFields,
  deleteCategory,
);

export default router;
