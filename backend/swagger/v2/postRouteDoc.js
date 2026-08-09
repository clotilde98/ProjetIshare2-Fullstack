/**
 * @swagger
 * /posts/byCategory:
 *   get:
 *     summary: Retrieve posts by category
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - PostV2
 *     parameters:
 *       - name: categoryName
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AllPostByCategoryV2'
 *       400: 
 *         description: missing category name
 *         content: 
 *           text/plain: 
 *               schema:
 *                  type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 */