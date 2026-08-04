/**
 * @swagger
 * /productType:
 *   post:
 *     summary: An administrator can create a category type
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - ProductTypeV2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductTypeSchemaV2'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/ProductTypeCreatedV2'
 *       400:
 *         description: ValidationError or Category name required
 *         content: 
 *           text/plain: 
 *              schema: 
 *                  type: string
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
 * /productType/:
 *   get:
 *     summary: Get categories filtered by name
 *     security:
 *       - bearerAuth: []
 *     tags: 
 *       - ProductTypeV2
 *     parameters:
 *       - name: categoryName
 *         in: query
 *         schema:
 *           type: string
 *         required: true
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
 *         $ref: '#/components/responses/CategoriesReadV2'
 *       400: 
 *         $ref: '#/components/responses/PaginationValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /productType/{id}:
 *   patch:
 *     summary: Only an administrator can modify a product category
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - ProductTypeV2
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductTypeSchemaV2'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProductTypeUpdatedV2'
 *       400:
 *         description: Validation error or category id invalid  
 *         content: 
 *            text/plain: 
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