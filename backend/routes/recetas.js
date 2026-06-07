const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Receta = require("../models/Receta");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const { categoria, dificultad, tags, busqueda } = req.query;

    const filtro = {};
    if (categoria) filtro.categoria = categoria;
    if (dificultad) filtro.dificultad = dificultad;
    if (tags) filtro.tags = { $in: tags.split(",") };
    if (busqueda) {
      filtro.$or = [
        { titulo: { $regex: busqueda, $options: "i" } },
        { descripcion: { $regex: busqueda, $options: "i" } },
      ];
    }

    const recetas = await Receta.find(filtro)
      .populate("autorId", "nombre email avatarUrl")
      .sort({ createdAt: -1 });

    res.json({ recetas, total: recetas.length });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
});

router.post(
  "/",
  auth,
  [
    body("titulo").trim().notEmpty().withMessage("El título es obligatorio"),
    body("descripcion")
      .trim()
      .notEmpty()
      .withMessage("La descripción es obligatoria"),
    body("categoria").notEmpty().withMessage("La categoría es obligatoria"),
    body("tiempoMin")
      .isInt({ min: 1 })
      .withMessage("El tiempo debe ser un número positivo"),
    body("porciones")
      .isInt({ min: 1 })
      .withMessage("Las porciones deben ser un número positivo"),
    body("dificultad").notEmpty().withMessage("La dificultad es obligatoria"),
    body("ingredientes")
      .isArray({ min: 1 })
      .withMessage("Debe haber al menos 1 ingrediente"),
    body("pasos").isArray({ min: 1 }).withMessage("Debe haber al menos 1 paso"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const recetaData = {
        ...req.body,
        autorId: req.usuario._id,
      };

      const receta = new Receta(recetaData);
      await receta.save();

      const recetaCompleta = await Receta.findById(receta._id).populate(
        "autorId",
        "nombre email avatarUrl",
      );

      res.status(201).json({
        message: "Receta creada exitosamente",
        receta: recetaCompleta,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  },
);

router.get("/:id", async (req, res) => {
  try {
    const receta = await Receta.findById(req.params.id).populate(
      "autorId",
      "nombre email avatarUrl bio",
    );

    if (!receta) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }

    res.json({ receta });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const receta = await Receta.findById(req.params.id);

    if (!receta) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }

    if (receta.autorId.toString() !== req.usuario._id.toString()) {
      return res
        .status(403)
        .json({ message: "No autorizado para editar esta receta" });
    }

    Object.assign(receta, req.body);
    await receta.save();

    const recetaActualizada = await Receta.findById(receta._id).populate(
      "autorId",
      "nombre email avatarUrl",
    );

    res.json({
      message: "Receta actualizada exitosamente",
      receta: recetaActualizada,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const receta = await Receta.findById(req.params.id);

    if (!receta) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }

    if (receta.autorId.toString() !== req.usuario._id.toString()) {
      return res
        .status(403)
        .json({ message: "No autorizado para eliminar esta receta" });
    }

    await Receta.findByIdAndDelete(req.params.id);

    res.json({ message: "Receta eliminada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
});

module.exports = router;
