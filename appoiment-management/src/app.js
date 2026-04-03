const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const appointmentRoutes = require("./routes/appointmentRoutes");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Appointment Management API',
            version: '1.0.0',
            description: 'API documentation for Appointment Management service',
        },
        servers: [{ url: 'http://localhost:5002' }, { url: '/api/appointments' }]
    },
    apis: ['./src/routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api/appointments/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get('/api/appointments/api-docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});

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
