import Router  from 'express';
import {loginRouter} from './loginRoute.js';
import { dashboardRouter } from './dashboardRoute.js';
import userRouter from './clientRoute.js';
import {postRouter} from './postRoute.js';
import {commentRouter} from './commentRoute.js';
import {productCategoryRouter} from './productCategoryRoute.js'; 
import {reservationRouter } from './reservationRoute.js';
import {getAllCities} from '../controller/v1/addressController.js';
import {checkJWT} from '../middleware/identification/jwt.js'
import { mustBeAdmin } from '../middleware/identification/mustBeAdmin.js';
import { getAllStats } from '../controller/v1/dashboardController.js';

export const createApiRouter = (loginController, dashboardController, productCategoryController, commentController, reservationController, postController, loginValidator,commentValidator, productCategoryValidator) => {
const router = Router();

router.use('/', loginRouter(loginController, loginValidator));
router.use('/', dashboardRouter(dashboardController))
router.use('/users',userRouter);
router.use('/posts', postRouter(postController));
router.use('/reservations', reservationRouter(reservationController));
router.use('/comments', commentRouter(commentController, commentValidator));
router.use("/productType", productCategoryRouter(productCategoryController, productCategoryValidator)); 

/**
 * @swagger
 * /getAllCities: 
 *    get: 
 *      summary: Get the complete list of cities
 *      tags:
 *        - Main level
 *      responses:
 *        200: 
 *          $ref: '#/components/responses/ReadAllCities'
 *        401: 
 *          $ref: '#/components/responses/UnauthorizedError'
 *        500:
 *          description: Error server
 *      
 */

router.get('/getAllCities',checkJWT, getAllCities);

return router; 
}
