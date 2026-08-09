import express from 'express';
import {createApiRouter} from './route/index.js';
import path from "path";
import { fileURLToPath } from 'url';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import http from 'http';
import *as loginControllerV1 from './controller/v1/loginController.js'; 
import *as loginControllerV2 from './controller/v2/loginController.js';
import *as dashboardControllerV1 from './controller/v1/dashboardController.js'; 
import *as  dashboardControllerV2 from './controller/v2/dashboardController.js';
import *as productCategoryControllerV1 from './controller/v1/productCategoryController.js';
import *as productCategoryControllerV2 from './controller/v2/productCategoryController.js';
import *as commentControllerV1 from './controller/v1/commentController.js';
import *as commentControllerV2 from './controller/v2/commentController.js';
import *as reservationControllerV1 from './controller/v1/reservationController.js';
import *as reservationControllerV2 from './controller/v2/reservationController.js';
import *as postControllerV1 from './controller/v1/postController.js';
import *as postControllerV2 from './controller/v2/postController.js'
import {clientValidatorMiddleware1, clientValidatorMiddleware2} from './middleware/validation.js';
import { commentValidatorMiddleware1, commentValidatorMiddleware2 } from './middleware/validation.js';
import {productCategoryValidatorMiddleware1, productCategoryValidatorMiddleware2} from './middleware/validation.js';

const app = express();
const useHttps = process.env.USE_HTTPS === 'true'; 
const port = useHttps ? process.env.HTTPS_PORT : process.env.PORT;
 
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

const productCategoryControllerV2Complete = {
    ...productCategoryControllerV1, 
    ...productCategoryControllerV2
}

const commentControllerV2Complete = {
    ...commentControllerV1, 
    ...commentControllerV2
}

const postControllerV2Complete = {
    ...postControllerV1, 
    ...postControllerV2
}

const RouterV1 = createApiRouter(loginControllerV1, dashboardControllerV1,productCategoryControllerV1, commentControllerV1, reservationControllerV1, postControllerV1, clientValidatorMiddleware1,commentValidatorMiddleware1, productCategoryValidatorMiddleware1); 
const RouterV2 = createApiRouter(loginControllerV2, dashboardControllerV2,productCategoryControllerV2Complete, commentControllerV2Complete , reservationControllerV2Complete, postControllerV2Complete, clientValidatorMiddleware2, commentValidatorMiddleware2, productCategoryValidatorMiddleware2); 
app.use('/api/1.0', RouterV1);
app.use('/api/2.0', RouterV2);

if(useHttps){
    https.createServer(
    {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem'),
        passphrase: process.env.SSL_PASSPHRASE
    },
    app
    ).listen(port, () => console.log(`Example app listening at https://localhost:${port}`));
}else{
        http.createServer(app).listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}


