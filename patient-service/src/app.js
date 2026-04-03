const express = require("express");
const cors = require("cors");
const patientRoutes = require("./routes/patientRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const setupSwagger = require("./config/swagger");

const app = express();
setupSwagger(app);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Patient Service is running",
    data: null,
  });
});

app.use("/api", patientRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
