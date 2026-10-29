import { matchedData } from "express-validator";
import { User } from "../models/User.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const data = matchedData(req);

    // Verificar unicidad de username y email
    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });

    if (existingUser) {
      return res.status(400).json({
        ok: false,
        message: "El email o el nombre de usuario ya están en uso",
      });
    }

    // Hashear contraseña
    data.password = await hashPassword(data.password);

    // Crear usuario
    const user = await User.create(data);

    // Excluir contraseña en la respuesta
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      ok: true,
      message: "Usuario registrado correctamente",
      data: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req);

    const user = await User.findOne({ email, deletedAt: null });
    if (!user) {
      return res
        .status(401)
        .json({ ok: false, message: "Credenciales inválidas" });
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ ok: false, message: "Credenciales inválidas" });
    }

    // Generar JWT y guardar en Cookie HTTP-Only
    const token = generateToken({ id: user._id, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      ok: true,
      message: "Sesión iniciada correctamente",
      data: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    const userResponse = req.user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      ok: true,
      data: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const data = matchedData(req);

    if (data.profile) {
      req.user.profile = { ...req.user.profile.toObject(), ...data.profile };
      await req.user.save();
    }

    const userResponse = req.user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      ok: true,
      message: "Perfil actualizado correctamente",
      data: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      ok: true,
      message: "Sesión cerrada correctamente",
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};
