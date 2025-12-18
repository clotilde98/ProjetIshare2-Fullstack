import { Router } from 'express';
import {getMyReservations, getReservation,createReservation, getReservationsByClientID, getReservationsByPostID, updateReservation, deleteReservation,getReservations} from '../controller/reservationController.js'
import {reservationValidatorMiddleware} from '../middleware/validation.js';
import {checkJWT} from '../middleware/identification/jwt.js'
import { mustBeAdmin } from '../middleware/identification/mustBeAdmin.js';



const router = Router();

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a reservation for a specific post for a user or create it yourself
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReservationSchema'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReservationResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 */


router.post("/", checkJWT, reservationValidatorMiddleware.createReservationValidator, createReservation);   

/**
 * @swagger
 * /reservations/me:
 *  get: 
 *   summary: The user wants to see their reservations
 *   security: 
 *      - bearerAuth: []
 *   responses: 
 *     200:
 *      $ref: '#/components/responses/ReservationsList'
 *     401:
 *      $ref: '#/components/responses/UnauthorizedError' 
 *     404: 
 *      $ref: '#/components/responses/ObjectNotFound'   
 *     500: 
 *      description: Server error   
 */

router.get("/me", checkJWT, getMyReservations);

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: The administrator wants to see the reservations made in the database.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: username
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReservationsList'
 *       400:
 *         description: Bad status, non-existent status in the choices
 *         content: 
 *            text/plain: 
 *                 schema:
 *                    type: string 
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/AccessDeniedError'
 *       500:
 *         description: Server error
 */

router.get("/",checkJWT ,mustBeAdmin,  getReservations);

/**
 * @swagger
 * /reservations/client/{id}:
 *  get:
 *   summary: Only an administrator can see all the reservations a customer has made
 *   security: 
 *      - bearerAuth: []
 *   parameters: 
 *      - name: id 
 *        in: path
 *        schema: 
 *          type: integer
*        required: true
 *        
 *   responses:
 *      200: 
 *        $ref: '#/components/responses/ReservationsList'
 *      400: 
 *        description: "Invalid client ID"
 *        content: 
 *            text/plain: 
 *                 schema:
 *                    type: string 
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404: 
 *        $ref: '#/components/responses/ObjectNotFound'
 *      500: 
 *        description: Server Error 
 */

router.get("/client/:id", checkJWT, mustBeAdmin, getReservationsByClientID);
/**
 * @swagger
 * /reservations/post/{id}: 
 *  get: 
 *   summary: As an administrator, you can see the bookings of a particular user.
 *   security: 
 *      - bearerAuth: []
 *   parameters:
 *      - name: id
 *        in: path
 *        schema: 
 *          type: integer
 *        required:  true
 *   responses:
 *      200: 
 *        $ref: '#/components/responses/ReservationsList'
 *      400:
 *        description: "Invalid post ID"  
 *        content: 
 *            text/plain: 
 *                 schema:
 *                    type: string 
 *      401: 
 *        $ref: '#/components/responses/UnauthorizedError' 
 *      403:
 *        $ref: '#/components/responses/AccessDeniedError'
 *      500: 
 *        description: Server error
 */

router.get("/post/:id", checkJWT, getReservationsByPostID);
/**
 * @swagger 
 * /reservations/{id}: 
 *  get: 
 *   summary: The administrator can view all reservations for a post, the user only those for their own post.
 *   security: 
 *      - bearerAuth: []
 *   parameters: 
 *      - name: id 
 *        in: path 
 *        required: true
 *        schema: 
 *          type: integer
 *   responses: 
 *      200: 
 *        $ref: '#/components/responses/ReservationResponse'
 *      400: 
 *        description: "Invalid reservation ID"
 *        content: 
 *            text/plain: 
 *                 schema:
 *                    type: string 
 *      401: 
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403: 
 *        $ref: '#/components/responses/AccessDeniedError'
 *      500: 
 *       description: Server Error
 */

router.get("/:id", checkJWT, mustBeAdmin, getReservation);
/**
 * @swagger
 * /reservations/{id}:
 *   patch:
 *     summary: Update a reservation
 *     security:
 *       - bearerAuth: []
 *     parameters: 
 *       - name: id
 *         in: path
 *         schema: 
 *            type: integer
 *         required:  true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReservationSchema'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReservationResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/AccessDeniedError'
 *       404:
 *         $ref: '#/components/responses/ObjectNotFound'
 *       500:
 *         description: Server error
 */


router.patch("/", checkJWT, reservationValidatorMiddleware.updateReservationValidator, updateReservation);
/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Delete a reservation by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *         content: 
 *            text/plain: 
 *                 schema:
 *                    type: string 
 *       400:
 *         description: Invalid reservation ID
 *         content: 
 *            text/plain: 
 *                 schema:
 *                    type: string 
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/AccessDeniedError'
 *       404:
 *         $ref: '#/components/responses/ObjectNotFound'
 *       500:
 *         description: Server error
 */

router.delete("/:id", checkJWT, deleteReservation);

export default router;

