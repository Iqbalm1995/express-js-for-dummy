import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const glob = require("glob");

// Resolve file paths matching the glob pattern

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API Documentation for retrieving users",
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const setupSwagger = (app: Express) => {
  const specs = swaggerJsDoc(options);

  app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
