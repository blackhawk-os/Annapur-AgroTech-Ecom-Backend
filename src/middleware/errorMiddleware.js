
const errorMiddleware = (err, req, res, next) => {
  console.error(" Error:", err);

  if (res.headersSent) return next(err);

  // Mongoose validation
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: Object.values(err.errors).map(e => e.message),
    });
  }

  // JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, error: "Token expired" });
  }

  // Duplicate key
  if (err.code === 11000) {
    return res.status(400).json({ success: false, error: "Duplicate key value" });
  }

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;
