import Router  from 'express';
import {checkJWT} from '../middleware/identification/jwt.js';
import {mustBeAdmin} from '../middleware/identification/mustBeAdmin.js';

export const  dashboardRouter = (controller) => {
const router = Router();

router.get('/stats', checkJWT, mustBeAdmin , controller.getAllStats); 
return router;
}
