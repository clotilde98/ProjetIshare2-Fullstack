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

/**
 * @swagger
 * /users/:
 *  post: 
 *    summary: Add a customer
 *    security:
 *      - bearerAuth: []
 *    tags: 
 *     - Customer
 *    responses:
 *       200: 
 *        $ref: '#/components/responses/UserAdded'
 *       400: 
 *        $ref: '#/components/responses/ValidationError'
 *       500: 
 *        description: Error Server 
 *  
 */


router.post("/", clientValidatorMiddleware.addClientValidator, uploadPhoto, createUser); 
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: The users want see this own account. 
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Customer
 *     responses:
 *        200:
 *         description: User profile returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *        401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *        404:
 *         $ref: '#/components/responses/UserAccount'
 *        500:
 *         description: Server error
 */

router.get("/me", checkJWT,isSameUser, getOwnUser);    



/**
 * @swagger
 * /users/:
 *   get:
 *     summary: An administrator want see the users. 
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
 * swagger
 * /users/{id}:
 *   delete:
 *     summary: A user wants to delete their account, or only an administrator can delete an account.
 *     tags:
 *       - Customer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the user to delete
 *     responses:
 *       204:
 *         $ref: '#/components/responses/DeletedUser'
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
  * /users:
  *  patch: 
  *   summary: A user wants to update their account, or only an administrator can update a customer account.
  *   security: 
  *    - bearerAuth: []
  *   tags:
  *    - Customer 
  *   requestBody: 
  *         content: 
  *             application/json: 
  *                 schema: 
  *                      $ref: '#/components/schemas/updateSchema'
  *     
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


router.patch("/:id", checkJWT, orMiddleware(isSameUser, mustBeAdmin), clientValidatorMiddleware.updateClientValidator , updateUser);  




export default router;


