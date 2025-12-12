import {default as swaggerJSDoc} from "swagger-jsdoc";
import * as fs from "node:fs";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API", 
            version: "1.0.0", 
        },
    },
    apis: [
        "./controller/**/*.js",
        "./middleware/**/*.js",
        "./route/**/*.js",
    ],
};

const swaggerSpec = swaggerJSDoc(options);
fs.writeFileSync("./swagger/spec.json", JSON.stringify(swaggerSpec));