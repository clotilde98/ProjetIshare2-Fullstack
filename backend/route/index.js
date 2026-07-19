import Router  from 'express';
import userRouter from './clientRoute.js';
import postRouter from './postRoute.js';
import reservationRouter from './reservationRoute.js';
import commentRouter from './commentRoute.js';
import {getAllCities} from '../controller/addressController.js';
import {login, loginWithGoogle} from '../controller/loginController.js'
import {checkJWT} from '../middleware/identification/jwt.js'
import { mustBeAdmin } from '../middleware/identification/mustBeAdmin.js';
import {clientValidatorMiddleware} from '../middleware/validation.js';
import { getAllStats } from '../controller/dashboardController.js';

import productTypeRouter from './productTypeRoute.js'

const router = Router();

router.use('/users',userRouter);
router.use('/posts', postRouter);
router.use('/reservations', reservationRouter);
router.use('/comments', commentRouter);
router.use('/productType', productTypeRouter);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticates a customer
 *     tags: 
 *       - Niveau principal
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
 *       - Niveau principal
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
 *      - Niveau principal
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
 *        - Niveau principal
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


export default router;