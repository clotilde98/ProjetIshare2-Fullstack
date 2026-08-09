/**
 * @swagger 
 * /stats: 
 *   get:
 *     summary: Get all application statistics
 *     security:
 *       - bearerAuth: []
 *     tags: 
 *      - Main level
 *     responses: 
 *       200:
 *          $ref: '#/components/responses/AllStatReaded' 
 *       401: 
 *          $ref: '#/components/responses/UnauthorizedError' 
 *       403: 
 *          $ref: '#/components/responses/AccessDeniedError'
 *       500: 
 *          description: Error server
 */
