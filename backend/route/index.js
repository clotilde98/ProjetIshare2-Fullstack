import Router  from 'express';
import userRouter from './clientRoute.js';
import postRouter from './postRoute.js';
import {commentRouter} from './commentRoute.js';
import {productTypeRouter} from './productTypeRoute.js'; 
import {reservationRouter } from './reservationRoute.js';
import {getAllCities} from '../controller/v1/addressController.js';
import {login, loginWithGoogle} from '../controller/v1/loginController.js'
import {checkJWT} from '../middleware/identification/jwt.js'
import { mustBeAdmin } from '../middleware/identification/mustBeAdmin.js';
import {clientValidatorMiddleware} from '../middleware/validation.js';
import { getAllStats } from '../controller/v1/dashboardController.js';

export const createApiRouter = (productTypeController, commentController, reservationController, commentValidator, productCategoryValidator) => {
const router = Router();

router.use('/users',userRouter);
router.use('/posts', postRouter);
router.use('/reservations', reservationRouter(reservationController));
router.use('/comments', commentRouter(commentController, commentValidator));
router.use("/productType", productTypeRouter(productTypeController, productCategoryValidator)); 

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticates a customer
 *     tags: 
 *       - Main level
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/loginSchema'
 *     responses:
 *       200: 
 *          $ref: '#/components/responses/ConnectionSuccess'
 *       400:
 *          $ref: '#/components/responses/ValidationError'
 *       401:
 *          $ref: '#/components/responses/InvalidInput'
 *       500:
 *         description: Error server
 */

router.post('/login',clientValidatorMiddleware.loginValidator, login)
/**
 * @swagger
 * /loginWithGoogle:
 *   post:
 *     summary: Authenticates a customer with Google
 *     tags:
 *       - Main level
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/loginSchema'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/ConnectionSuccess'
 *       '401':
 *         $ref: '#/components/responses/InvalidInput'
 */


router.post('/loginWithGoogle', clientValidatorMiddleware.loginValidator, loginWithGoogle)
/**
 * @swagger 
 * /stats: 
 *   post:
 *     summary: Get all application statistics
 *     tags: 
 *      - Main level
 *     responses: 
 *       200:
 *          $ref: '#/components/responses/AllStatReaded' 
 *       401: 
 *          $ref: '#/components/responses/UnauthorizedError' 
 *       403: 
 *          $ref: '#/components/responses/AccessDeniedError'
 *       500: 
 *          description: Error server
 */

router.get('/stats', checkJWT, mustBeAdmin , getAllStats)
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
