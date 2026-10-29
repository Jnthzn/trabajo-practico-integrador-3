import { verifyToken } from "../helpers/jwt.helper.js";
import { User } from "../models/User.js";
import { Event } from "../models/Event.js";

// 1. Verifica si el usuario está autenticado por Cookie
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: "Acceso denegado. Token no proporcionado",
      });
    }

    // Decodifica el token
    const decoded = verifyToken(token);

    // Busca al usuario sin incluir eliminados lógicamente (deletedAt: null)
    const user = await User.findOne({ _id: decoded.id, deletedAt: null });

    if (!user) {
      return res
        .status(401)
        .json({ ok: false, message: "Token no válido o usuario inexistente" });
    }

    // Guarda los datos del usuario en req.user para los siguientes middlewares o controladores
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ ok: false, message: "Token inválido o expirado" });
  }
};

// 2. Verifica si el usuario autenticado es ADMIN
export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    ok: false,
    message: "Acceso restringido. Se requieren permisos de administrador",
  });
};

// 3. Verifica si el usuario es el dueño del evento o es ADMIN
export const ownerOrAdminMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res
        .status(404)
        .json({ ok: false, message: "Evento no encontrado" });
    }

    // Si es admin o si el id del organizador coincide con el usuario logueado
    const isOwner = event.organizer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (isOwner || isAdmin) {
      req.event = event; // Guardamos el evento encontrado para no volver a consultarlo
      return next();
    }

    return res.status(403).json({
      ok: false,
      message: "No tienes permisos para modificar este evento",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};
