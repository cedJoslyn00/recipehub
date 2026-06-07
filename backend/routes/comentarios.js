const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Comentario = require("../models/Comentario");
const Receta = require("../models/Receta");
const auth = require("../middleware/auth");

router.get("/recetas/:id/comentarios", async (req, res) => {
  try {
    const comentarios = await Comentario.find({ recetaId: req.params.id })
      .populate("usuarioId", "nombre email avatarUrl")
      .sort({ createdAt: -1 });

    res.json({ comentarios, total: comentarios.length });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
});

router.post(
  "/recetas/:id/comentarios",
  auth,
  [
    body("texto").trim().notEmpty().withMessage("El texto es obligatorio"),
    body("calificacion")
      .isInt({ min: 1, max: 5 })
      .withMessage("La calificación debe ser entre 1 y 5"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const receta = await Receta.findById(req.params.id);
      if (!receta) {
        return res.status(404).json({ message: "Receta no encontrada" });
      }

      const comentario = new Comentario({
        recetaId: req.params.id,
        usuarioId: req.usuario._id,
        texto: req.body.texto,
        calificacion: req.body.calificacion,
      });

      await comentario.save();

      const comentarioCompleto = await Comentario.findById(
        comentario._id,
      ).populate("usuarioId", "nombre email avatarUrl");

      res.status(201).json({
        message: "Comentario agregado exitosamente",
        comentario: comentarioCompleto,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  },
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.id);

    if (!comentario) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    if (comentario.usuarioId.toString() !== req.usuario._id.toString()) {
      return res
        .status(403)
        .json({ message: "No autorizado para eliminar este comentario" });
    }

    await Comentario.findByIdAndDelete(req.params.id);

    res.json({ message: "Comentario eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
});

module.exports = router;
