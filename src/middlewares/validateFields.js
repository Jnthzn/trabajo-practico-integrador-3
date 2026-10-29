import { validationResult } from "express-validator";

export const validateFields = (req, res, next) => {
  // Junta todos los errores que encontró express-validator en la petición
  const errors = validationResult(req);

  // Si la lista de errores no está vacía, frena la petición y devuelve un 400 Bad Request
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  // Si no hay errores, deja pasar la petición hacia el siguiente middleware o controlador
  next();
};
