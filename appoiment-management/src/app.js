const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Root Route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Appointment Management Service API",
        version: "1.0.0",
        status: "Healthy"
    });
});

// Routes
app.use("/api/appointments", appointmentRoutes);

// Error Handling Middleware
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});

module.exports = app;
