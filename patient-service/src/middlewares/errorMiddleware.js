const errorHandler = (err, req, res, next) => {
  // Handle Mongoose validation errors in a readable way.
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((item) => item.message);

    return res.status(400).json({
      success: false,
      message: errors.join(", "),
      data: null,
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
    data: null,
  });
};

const notFound = (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
    data: null,
  });
};

module.exports = {
  errorHandler,
  notFound,
};
