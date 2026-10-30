import { Router } from "express";
import {
  createEvent,
  getEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
import { eventValidator, mongoIdValidator } from "../middlewares/validators.js";
import { validateFields } from "../middlewares/validateFields.js";
import {
  authMiddleware,
  ownerOrAdminMiddleware,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas para usuarios autenticados
router.get("/", authMiddleware, getEvents);
router.get("/my", authMiddleware, getMyEvents);
router.get(
  "/:id",
  authMiddleware,
  mongoIdValidator,
  validateFields,
  getEventById,
);

router.post("/", authMiddleware, eventValidator, validateFields, createEvent);

// Rutas protegidas por organizador o admin
router.put(
  "/:id",
  authMiddleware,
  mongoIdValidator,
  ownerOrAdminMiddleware,
  eventValidator,
  validateFields,
  updateEvent,
);

router.delete(
  "/:id",
  authMiddleware,
  mongoIdValidator,
  ownerOrAdminMiddleware,
  deleteEvent,
);

export default router;
