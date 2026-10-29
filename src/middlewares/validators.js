import { body, param } from "express-validator";
import { Category } from "../models/Category.js";

// Validaciones para Auth / Registro
export const registerValidator = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("El username solo debe contener letras y números"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Debe proporcionar un email válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe contener al menos una mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe contener al menos una minúscula")
    .matches(/[0-9]/)
    .withMessage("La contraseña debe contener al menos un número"),
  body("role").optional().isIn(["user", "admin"]).withMessage("Rol no válido"),
  body("profile.firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El nombre solo debe contener letras"),
  body("profile.lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El apellido solo debe contener letras"),
  body("profile.birthDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Fecha de nacimiento no válida")
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error("La fecha de nacimiento no puede ser futura");
      }
      return true;
    }),
  body("profile.phone")
    .optional({ nullable: true })
    .isNumeric()
    .withMessage("El teléfono solo debe contener números")
    .isLength({ min: 8, max: 15 })
    .withMessage("El teléfono debe tener entre 8 y 15 dígitos"),
];

// Validaciones para Login
export const loginValidator = [
  body("email").trim().isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

// Validaciones para Categorías
export const categoryValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres"),
  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede superar los 200 caracteres"),
];

// Validaciones para Eventos
export const eventValidator = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres"),
  body("description")
    .trim()
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres"),
  body("startDate").isISO8601().withMessage("Fecha de inicio no válida"),
  body("endDate")
    .isISO8601()
    .withMessage("Fecha de fin no válida")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error(
          "La fecha de fin debe ser posterior a la fecha de inicio",
        );
      }
      return true;
    }),
  body("capacity")
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un entero mayor o igual a 1"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),
  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("Estado no válido"),
  body("location.venue")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("El lugar debe tener entre 3 y 100 caracteres"),
  body("location.address")
    .trim()
    .isLength({ min: 5, max: 150 })
    .withMessage("La dirección debe tener entre 5 y 150 caracteres"),
  body("location.city")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),
  body("categories")
    .optional()
    .isArray()
    .withMessage("Categorías debe ser un arreglo de IDs")
    .custom(async (categories) => {
      if (categories && categories.length > 0) {
        const count = await Category.countDocuments({
          _id: { $in: categories },
        });
        if (count !== categories.length) {
          throw new Error("Una o más categorías enviadas no existen");
        }
      }
      return true;
    }),
];

// Validación de MongoID por parámetro
export const mongoIdValidator = [
  param("id").isMongoId().withMessage("ID de Mongo no válido"),
];
