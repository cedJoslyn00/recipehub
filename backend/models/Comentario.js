const mongoose = require("mongoose");

const comentarioSchema = new mongoose.Schema({
  recetaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Receta",
    required: [true, "El ID de la receta es obligatorio"],
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: [true, "El ID del usuario es obligatorio"],
  },
  texto: {
    type: String,
    required: [true, "El texto del comentario es obligatorio"],
    trim: true,
    maxlength: [1000, "El comentario no puede exceder 1000 caracteres"],
  },
  calificacion: {
    type: Number,
    required: [true, "La calificación es obligatoria"],
    min: [1, "La calificación mínima es 1"],
    max: [5, "La calificación máxima es 5"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

comentarioSchema.index({ recetaId: 1, createdAt: -1 });

module.exports = mongoose.model("Comentario", comentarioSchema);
