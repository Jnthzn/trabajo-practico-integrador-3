import { User } from "../models/User.js";

// GET /api/users (Solo Admin)
export const getUsers = async (req, res) => {
  try {
    // Retorna todos los usuarios que no han sido eliminados lógicamente
    const users = await User.find({ deletedAt: null }).select("-password");
    return res.status(200).json({ ok: true, data: users });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, deletedAt: null })
      .select("-password")
      .populate("events"); // Virtual populate de eventos organizados

    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }

    return res.status(200).json({ ok: true, data: user });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// DELETE /api/users/:id (Eliminación lógica - Soft Delete)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id, deletedAt: null });
    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }

    // Marca la fecha de baja sin borrar el registro de MongoDB
    user.deletedAt = new Date();
    await user.save();

    return res.status(200).json({
      ok: true,
      message: "Usuario eliminado lógicamente de forma correcta",
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};
