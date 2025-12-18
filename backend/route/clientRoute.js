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
 * /users/admin:
 *   post:
 *     summary: Add a new customer (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Customer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/AddClientSchema'
 *               - type: object
 *                 properties:
 *                   file:
 *                     type: string
 *                     format: binary
 *     responses:
 *       200:
 *         description: User added successfully
 *         content: 
 *            text/plain: 
 *                 schema:
 *                    type: string 
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         $ref: '#/components/responses/ObjectCompetingEdition'
 *       500:
 *         description: Server error
 */


router.post("/admin", checkJWT, upload.single('photo'), clientValidatorMiddleware.addClientValidator, createUserWithAdmin); 

/**
 * @swagger
 * /users/:
 *   post:
 *     summary: Add a customer
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Customer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/AddClientSchema'
 *               - type: object
 *                 properties:
 *                   file:
 *                     type: string
 *                     format: binary
 *     responses:
 *       200:
 *         description: User added successfully
 *         content: 
 *            text/plain: 
 *                 schema:
 *                    type: string 
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         $ref: '#/components/responses/ObjectCompetingEdition'
 *       500:
 *         description: Server error
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
 *         $ref: '#/components/responses/UserAccount' 
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
 *         description: "The role is invalid"
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



router.get("/", checkJWT,mustBeAdmin, getUsers);   
/**
 * @swagger
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
 *     responses:
 *       200:
 *         description: The user is deleted from the database
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


router.delete("/:id", checkJWT, deleteUser);       

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: User deletes their own account
 *     tags:
 *       - Customer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user is deleted from the database
 *         content: 
 *            text/plain: 
 *                 schema:
 *                    type: string 
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/ObjectNotFound'
 *       500:
 *         description: Server error
 */



router.delete("/", checkJWT, deleteUser)

/**
 * @swagger
 * /users/:
 *   patch:
 *     summary: A user or an administrator wants to update his account
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Customer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/UpdateSchema'
 *               - type: object
 *                 properties:
 *                   file:
 *                     type: string
 *                     format: binary
 *     responses:
 *       200:
 *         description: The user was updated in the database
 *         content: 
 *            text/plain: 
 *                 schema:
 *                    type: string  
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



router.patch("/", checkJWT, upload.single("photo"), clientValidatorMiddleware.updateClientValidator , updateUser)


/**
 * @swagger
 * /users/:
 *   patch:
 *     summary: An administrator want uptate an user account 
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Customer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/UpdateSchema'
 *               - type: object
 *                 properties:
 *                   file:
 *                     type: string
 *                     format: binary
 *     responses:
 *       200:
 *         description: The user was updated in the database 
 *         content: 
 *            text/plain: 
 *                 schema:
 *                    type: string 
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


router.patch("/:id", checkJWT, upload.single("photo"),  clientValidatorMiddleware.updateClientValidator , updateUser);  




export default router;


