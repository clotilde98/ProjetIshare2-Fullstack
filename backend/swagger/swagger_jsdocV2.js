import { default as swaggerJSDoc } from "swagger-jsdoc";
import * as fs from "node:fs";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API",
      version: "1.0.0",
    },
    components: {
      responses: {
        ObjectNotFound: {
          description: "Not found",
          content: {
            "text/plain": {
              schema: {
                type: "string",
              },
            },
          },
        },
        ObjectCompetingEdition: {
          description: "Already exists",
          content: {
            "text/plain": {
              schema: {
                type: "string",
              },
            },
          },
        },
        AccessDeniedError: {
          description: "Admin privilege required", 
          content: {
            "text/plain": {
              schema: {
                type: "string", 
              }
            }
          }
        }
      },
      schemas: {
        loginSchema: {
          type: "object",
          properties: {
            email: {
              type: "string",
            },
            password: {
              type: "string",
            },
            idToken: {
              type: "string",
            },
          },
        },
      },
    },
  },
  apis: [
    "./controller/v2/**/*.js",
    "./middleware/identification/**/*.js",
    "./middleware/validation.js",
    "./middleware/validator/v2/**/*.js",
    "./route/v2/**/*.js",
    "./swagger/v2/**/*.js", 
    "./errors/**/*.js"
  ],
};

const swaggerSpec = swaggerJSDoc(options);
fs.writeFileSync("./swagger/spec.json", JSON.stringify(swaggerSpec, null, 2));

console.log("Swagger spec generated in ./swagger/spec.json");