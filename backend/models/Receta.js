const mongoose = require("mongoose");

const recetaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, "El título es obligatorio"],
    trim: true,
  },
  descripcion: {
    type: String,
    required: [true, "La descripción es obligatoria"],
    trim: true,
  },
  categoria: {
    type: String,
    required: [true, "La categoría es obligatoria"],
    enum: ["Desayuno", "Almuerzo", "Cena", "Postre", "Snack", "Bebida", "Otro"],
  },
  tiempoMin: {
    type: Number,
    required: [true, "El tiempo de preparación es obligatorio"],
    min: [1, "El tiempo debe ser al menos 1 minuto"],
  },
  porciones: {
    type: Number,
    required: [true, "El número de porciones es obligatorio"],
    min: [1, "Debe haber al menos 1 porción"],
  },
  dificultad: {
    type: String,
    required: [true, "La dificultad es obligatoria"],
    enum: ["Fácil", "Media", "Difícil"],
  },
  ingredientes: [
    {
      nombre: {
        type: String,
        required: true,
        trim: true,
      },
      cantidad: {
        type: Number,
        required: true,
      },
      unidad: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  pasos: [
    {
      type: String,
      trim: true,
    },
  ],
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  autorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: [true, "El autor es obligatorio"],
  },
  imagenUrl: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

recetaSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

recetaSchema.index({ titulo: "text", tags: "text" });
recetaSchema.index({ categoria: 1, dificultad: 1 });

module.exports = mongoose.model("Receta", recetaSchema);
