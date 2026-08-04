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
 *                   photo:
 *                     type: string
 *                     format: binary
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserAdded'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         $ref: '#/components/responses/ObjectCompetingEdition'
 *       500:
 *         description: Server error
 */

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
 *                   photo:
 *                     type: string
 *                     format: binary
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserAdded'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         $ref: '#/components/responses/ObjectCompetingEdition'
 *       500:
 *         description: Server error
 */

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
 *         $ref: '#/components/responses/ReadAllUsers'
 *       400:
 *         $ref: '#/components/responses/InvalidRole'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/AccessDeniedError'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /users:
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
 *                   photo:
 *                     type: string
 *                     format: binary
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserAccount'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Invalid or expired JWT OR current password incorrect 
 *         content: 
 *            text/Plain: 
 *                schema: 
 *                    type: string 
 *       403:
 *         $ref: '#/components/responses/AccessDeniedError'
 *       404:
 *         $ref: '#/components/responses/ObjectNotFound'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: A user or an administrator wants to update his account
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Customer
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/UpdateSchema'
 *               - type: object
 *                 properties:
 *                   photo:
 *                     type: string
 *                     format: binary
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserAccount'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Invalid or expired JWT OR current password incorrect
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       403:
 *         $ref: '#/components/responses/AccessDeniedError'
 *       404:
 *         $ref: '#/components/responses/ObjectNotFound'
 *       500:
 *         description: Server error
 */


