
import express from 'express';
import {default as Router} from './route/index.js';

import cors from 'cors';

const app = express();
const port = 3002;

app.use(cors({
    origin: 'http://localhost:5174',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(Router);




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);

    
});