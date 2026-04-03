const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Patient Service API",
      version: "1.0.0",
      description: "API documentation for the Patient Service",
    },
    servers: [
      {
        url: "http://localhost:8082",
        description: "Local server",
      },
      {
        url: "/api/patients",
        description: "Gateway proxy",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to the API docs
};

const specs = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use("/api/patients/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  app.get("/api/patients/api-docs-json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });
};

module.exports = setupSwagger;
