import { Router } from 'express';
import {checkJWT} from '../middleware/identification/jwt.js'

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

import {upload} from '../middleware/photo/upload.js';


const router = Router();





router.post("/", upload.single('photo'), clientValidatorMiddleware.addClientValidator, createUser); 
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

router.get("/me", checkJWT, getOwnUser);    

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

router.get("/", checkJWT, mustBeAdmin, getUsers);      
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

router.delete("/", checkJWT, deleteUser); 

router.delete("/:id", checkJWT, deleteUser);       

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


router.patch("/", checkJWT, upload.single("photo"), clientValidatorMiddleware.updateClientValidator , updateUser);  


router.patch("/:id", checkJWT, upload.single("photo"), clientValidatorMiddleware.updateClientValidator , updateUser);  




export default router;


