/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticates a user
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
 *          $ref: '#/components/responses/ConnectionSuccessV2'
 *       400:
 *          $ref: '#/components/responses/ValidationError'
 *       401:
 *          $ref: '#/components/responses/InvalidInput'
 *       500:
 *         description: Error server
 */

/**
 * @swagger
 * /loginWithGoogle:
 *   post:
 *     summary: Authenticates a user with Google
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
 *        200:
 *         $ref: '#/components/responses/ConnectionSuccessV2'
 *        400:
 *          $ref: '#/components/responses/ValidationError'
 *        401:
 *         $ref: '#/components/responses/InvalidInput'
 *        500:
 *         description: Error server
 */

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refreshes the access token using a refresh token
 *     tags:
 *       - Main level
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/refreshTokenSchemaV2"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/ConnectionSuccessV2"
 *       400:
 *          $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Refresh token invalid
 *       500:
 *         description: Error server
 */
