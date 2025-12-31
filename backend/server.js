
import express from 'express';
import {default as Router} from './route/index.js';
import path from "path";
import { fileURLToPath } from 'url';
import { initWebSocket } from './websocket.js';
import cors from 'cors';

const app = express();
const port = 3002;

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
app.use(Router);





app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);

    
});