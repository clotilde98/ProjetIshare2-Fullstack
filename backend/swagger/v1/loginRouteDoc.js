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
 *          $ref: '#/components/responses/ConnectionSuccess'
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
 *         $ref: '#/components/responses/ConnectionSuccess'
 *        400:
 *          $ref: '#/components/responses/ValidationError'
 *        401:
 *         $ref: '#/components/responses/InvalidInput'
 *        500:
 *         description: Error server
 */