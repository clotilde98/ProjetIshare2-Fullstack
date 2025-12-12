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



router.post("/", upload.single('photo'), clientValidatorMiddleware.addClientValidator, createUser); 
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

router.get("/me", checkJWT, getOwnUser);    



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

<<<<<<< HEAD
router.get("/", checkJWT, mustBeAdmin, getUsers);      
=======


router.get("/", checkJWT,mustBeAdmin, getUsers);   

>>>>>>> 4c6f223dde37bad8a8731b887a65e664194c1273
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

<<<<<<< HEAD
router.delete("/", checkJWT, deleteUser); 

router.delete("/:id", checkJWT, deleteUser);       
=======

router.delete("/:id", checkJWT,orMiddleware(isSameUser, mustBeAdmin) , deleteUser);       
>>>>>>> 4c6f223dde37bad8a8731b887a65e664194c1273

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


<<<<<<< HEAD
router.patch("/", checkJWT, upload.single("photo"), clientValidatorMiddleware.updateClientValidator , updateUser);  


router.patch("/:id", checkJWT, upload.single("photo"), clientValidatorMiddleware.updateClientValidator , updateUser);  
=======
router.patch("/:id", checkJWT, orMiddleware(isSameUser, mustBeAdmin), clientValidatorMiddleware.updateClientValidator , updateUser);  
>>>>>>> 4c6f223dde37bad8a8731b887a65e664194c1273




export default router;


