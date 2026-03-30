const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gumgumji's BugScope API",
      version: "1.0.0",
      description: "Alpha- Error Logging and Monitoring API",
    },
   servers: [
  {
    url: "https://bugscope.onrender.com",
    description: "Production"
  },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
      },
    },
  },
  apis: ["./index.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;