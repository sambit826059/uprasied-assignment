import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gadgets API",
      version: "1.0.0",
      description: "API for managing gadgets",
    },
    servers: [
      {
        url: "https://uprasied-assignment.onrender.com/api/v1",
      },
      {
        url: "http://localhost:3000/api/v1",
      },
    ],
  },
  apis: ["../dist/routes/*.js", "./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
  app.get("/api/v1/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
