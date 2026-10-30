import { matchedData } from "express-validator";
import { Event } from "../models/Event.js";

// POST /api/events
export const createEvent = async (req, res) => {
  try {
    const data = matchedData(req);

    const existingEvent = await Event.findOne({ title: data.title });
    if (existingEvent) {
      return res
        .status(400)
        .json({ ok: false, message: "Ya existe un evento con ese título" });
    }

    const event = await Event.create({
      ...data,
      organizer: req.user._id,
    });

    return res.status(201).json({ ok: true, data: event });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "username email profile")
      .populate("categories", "name description");

    return res.status(200).json({ ok: true, data: events });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/events/my
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).populate(
      "categories",
      "name description",
    );

    return res.status(200).json({ ok: true, data: events });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// GET /api/events/:id
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id)
      .populate("organizer", "username email profile")
      .populate("categories", "name description");

    if (!event) {
      return res
        .status(404)
        .json({ ok: false, message: "Evento no encontrado" });
    }

    return res.status(200).json({ ok: true, data: event });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// PUT /api/events/:id
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = matchedData(req);

    if (data.title) {
      const existing = await Event.findOne({
        title: data.title,
        _id: { $ne: id },
      });
      if (existing) {
        return res
          .status(400)
          .json({ ok: false, message: "Ya existe otro evento con ese título" });
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, data, { new: true })
      .populate("organizer", "username email profile")
      .populate("categories", "name description");

    return res.status(200).json({ ok: true, data: updatedEvent });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);

    return res.status(200).json({
      ok: true,
      message: "Evento eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};
