import { Router } from 'express';
import {checkJWT} from '../middleware/identification/jwt.js'
import { uploadPhoto } from '../middleware/photo/upload.js';
import {
  updateUser,
  deleteUser,
  createUser,
  getUsers,
  getOwnUser
} from "../controller/clientController.js";

import {clientValidatorMiddleware} from '../middleware/validation.js';

import {isSameUser} from '../middleware/identification/user.js'

import {mustBeAdmin} from '../middleware/identification/mustBeAdmin.js'

import { orMiddleware } from '../middleware/utils/orMiddleware.js';


const router = Router();




router.post("/", clientValidatorMiddleware.addClientValidator, uploadPhoto, createUser); 
/**
 * @swagger
 * /me:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Customer
 *     responses:
 *       '200':
 *         description: User profile returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '404':
 *         $ref: '#/components/responses/UserAccount'
 *       '500':
 *         description: Server error
 */

router.get("/me", checkJWT,isSameUser, getOwnUser);    

/**
 * @swagger
 * /{id}:
 *   get:
 *     parameters: 
 *       - name: id 
 *         in: path
 *         required: true 
 *         schema: 
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Customer
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReadedUser'
 *       400:
 *         $ref: '#/components/responses/InvalidRole'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/mustBeAdmin'
 *       500:
 *         description: Server error
 */

router.get("/", checkJWT,mustBeAdmin, getUsers);      
/**
 * @swagger
 * /{id}:
 *   delete:
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the user to delete
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Customer
 *     responses:
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/AccessDeniedError'
 *       404:
 *         $ref: '#/components/responses/UserNotFound'
 *       500:
 *         description: Server error
 */

router.delete("/:id", checkJWT,orMiddleware(isSameUser, mustBeAdmin) , deleteUser);       

/**
  * @swagger 
  * /:
  *  patch: 
  *   security: 
  *    - bearerAuth: []
  *   tags:
  *    - Customer 
  *   responses: 
  *     400: 
  *       $ref: '#/components/responses/ValidationError'
  *     401: 
  *       $ref: '#/components/responses/UnauthorizedError' 
  *     403: 
  *       $ref: '#/components/responses/AccessDeniedError'
  *     404:
  *       $ref: '#/components/responses/UserNotFound'
  *     500: 
  *       description: Error server 
  *    
  */


router.patch("/id", checkJWT, orMiddleware(isSameUser, mustBeAdmin), clientValidatorMiddleware.updateClientValidator , updateUser);  




export default router;


