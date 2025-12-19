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
    },
  },
  apis: [
    "./controller/**/*.js",
    "./middleware/**/*.js",
    "./route/**/*.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);
fs.writeFileSync("./swagger/spec.json", JSON.stringify(swaggerSpec, null, 2));

console.log("Swagger spec generated in ./swagger/spec.json");
