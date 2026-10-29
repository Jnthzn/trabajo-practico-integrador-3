import jwt from "jsonwebtoken";

// Genera el token con los datos del usuario
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  });
};

// Verifica si el token es válido
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
