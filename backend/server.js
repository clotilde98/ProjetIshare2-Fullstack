import express from 'express';
import {createApiRouter} from './route/index.js';
import path from "path";
import { fileURLToPath } from 'url';
import { initWebSocket } from './websocket.js';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import http from 'http';
import *as productTypeControllerV1 from './controller/v1/productTypeController.js';
import *as productTypeControllerV2 from './controller/v2/productTypeController.js';
import *as commentControllerV1 from './controller/v1/commentController.js';
import *as commentControllerV2 from './controller/v2/commentController.js';
import *as reservationControllerV1 from './controller/v1/reservationController.js';
import *as reservationControllerV2 from './controller/v2/reservationController.js';
import { commentValidatorMiddleware1, commentValidatorMiddleware2 } from './middleware/validation.js';
import {productCategoryValidatorMiddleware1, productCategoryValidatorMiddleware2} from './middleware/validation.js';
const app = express();
const useHttps = process.env.USE_HTTPS === 'true'; 
const port = useHttps ? process.env.HTTPS_PORT : process.env.PORT;

initWebSocket();
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));



app.use('/images', express.static(path.join(__dirname, 'middleware/photo')));
app.use(express.json());

const reservationControllerV2Complete = {
    ...reservationControllerV1, 
    ...reservationControllerV2
}

const RouterV1 = createApiRouter(productTypeControllerV1, commentControllerV1, reservationControllerV1,commentValidatorMiddleware1, productCategoryValidatorMiddleware1); 
const RouterV2 = createApiRouter(productTypeControllerV2, commentControllerV2, reservationControllerV2Complete, commentValidatorMiddleware2, productCategoryValidatorMiddleware2); 
app.use('/api/1.0', RouterV1);
app.use('/api/2.0', RouterV2);

if(useHttps){
    https.createServer({ key: fs.readFileSync('key.pem'), cert: fs.readFileSync('cert.pem') }, app).listen(port, () => console.log(`Example app listening at https://localhost:${port}`));
}else{
    http.createServer(app).listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
}


