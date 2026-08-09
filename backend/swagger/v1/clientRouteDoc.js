/**
 * @swagger
 * /users/:
 *   post:
 *     summary: Add a user
 *     tags:
 *       - User
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
 *     summary: Add a new user (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/AddClientSchema'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserAdded'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/AccessDeniedError'
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
 *       - User
 *     responses:
 *        200:
 *         $ref: '#/components/responses/UserAccount' 
 *        401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *        404: 
 *         $ref: '#/components/responses/ObjectNotFound'
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
 *       - User
 *     parameters: 
 *       - name: name
 *         in: query
 *         schema: 
 *           type: string
 *         required: false
 *       - name: role
 *         in: query
 *         schema: 
 *           type: string
 *           enum: 
 *             - admin
 *             - user
 *         required: false
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false       
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReadAllUsers'
 *       400:
 *         description: Invalid role filter or invalid pagination
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
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
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user is deleted from the database
 *         content: 
 *            text/plain: 
 *                 schema:
 *                    type: string 
 *       400: 
 *         description: Invalid user ID
 *         content: 
 *           text/plain: 
 *               schema:
 *                  type: string
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
 *     summary: only an administrator can delete an account with user id 
 *     tags:
 *       - User
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
 *       400: 
 *         description: Invalid user ID
 *         content: 
 *           text/plain: 
 *               schema:
 *                  type: string
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
 *       - User
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
 *         description: Invalid or expired JWT OR old password is missing/incorrect 
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
 *       - User
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
 *         description: Invalid user ID or validation error (body)
 *         content: 
 *           text/plain: 
 *               schema:
 *                  type: string
 *       401:
 *         description: Invalid or expired JWT OR old password is missing/incorrect
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