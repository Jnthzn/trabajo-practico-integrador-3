import { matchedData } from "express-validator";
import { Category } from "../models/Category.js";
import { Event } from "../models/Event.js";

// POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const data = matchedData(req);

    const existingCategory = await Category.findOne({ name: data.name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ ok: false, message: "La categoría ya existe" });
    }

    const category = await Category.create(data);
    return res.status(201).json({ ok: true, data: category });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ ok: true, data: categories });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/categories/:id
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).populate("events");

    if (!category) {
      return res
        .status(404)
        .json({ ok: false, message: "Categoría no encontrada" });
    }

    return res.status(200).json({ ok: true, data: category });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = matchedData(req);

    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ ok: false, message: "Categoría no encontrada" });
    }

    // Si cambia el nombre, verificar que no esté repetido
    if (data.name && data.name !== category.name) {
      const existing = await Category.findOne({ name: data.name });
      if (existing) {
        return res
          .status(400)
          .json({
            ok: false,
            message: "Ya existe una categoría con ese nombre",
          });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, data, {
      new: true,
    });
    return res.status(200).json({ ok: true, data: updatedCategory });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// DELETE /api/categories/:id (Eliminación en cascada)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ ok: false, message: "Categoría no encontrada" });
    }

    // Eliminación en cascada: remover esta categoría del array categories de los eventos que la usan
    await Event.updateMany({ categories: id }, { $pull: { categories: id } });

    // Eliminar la categoría
    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      ok: true,
      message: "Categoría eliminada y removida de los eventos asociados",
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};
