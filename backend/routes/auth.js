const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Usuario = require("../models/Usuario");
const auth = require("../middleware/auth");

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

router.post(
  "/register",
  [
    body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("Email no válido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nombre, email, password } = req.body;

      const usuarioExiste = await Usuario.findOne({ email });
      if (usuarioExiste) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      const usuario = new Usuario({ nombre, email, password });
      await usuario.save();

      const token = generarToken(usuario._id);

      res.status(201).json({
        message: "Usuario registrado exitosamente",
        token,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  },
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email no válido"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const esPasswordCorrecto = await usuario.compararPassword(password);
      if (!esPasswordCorrecto) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const token = generarToken(usuario._id);

      res.json({
        message: "Login exitoso",
        token,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          bio: usuario.bio,
          avatarUrl: usuario.avatarUrl,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  },
);

router.get("/me", auth, async (req, res) => {
  try {
    res.json({
      usuario: {
        id: req.usuario._id,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
        bio: req.usuario.bio,
        avatarUrl: req.usuario.avatarUrl,
        createdAt: req.usuario.createdAt,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
});

module.exports = router;
