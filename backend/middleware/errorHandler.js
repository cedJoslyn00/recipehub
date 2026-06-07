const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      message: "Error de validación",
      errors: messages,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "ID no válido",
      error: err.message,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${field} ya existe`,
      error: err.message,
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

module.exports = errorHandler;
