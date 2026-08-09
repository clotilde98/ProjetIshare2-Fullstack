/**
 * @swagger 
 * /stats: 
 *   post:
 *     summary: Get all application statistics
 *     tags: 
 *      - Main level
 *     responses: 
 *       200:
 *          $ref: '#/components/responses/AllStatReadedV2' 
 *       401: 
 *          $ref: '#/components/responses/UnauthorizedError' 
 *       403: 
 *          $ref: '#/components/responses/AccessDeniedError'
 *       500: 
 *          description: Error server
 */