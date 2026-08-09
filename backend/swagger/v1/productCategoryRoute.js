/**
 * @swagger
 * /productType:
 *   post:
 *     summary: An administrator can create a category product
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - ProductCategory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductCategorySchema'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/ProductCategoryCreated'
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
 *       - ProductCategory
 *     parameters:
 *       - name: nameCategory
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
 *         $ref: '#/components/responses/CategoriesRead'
 *       400: 
 *         description: Invalid category name or pagination error
 *         content: 
 *           text/plain: 
 *              schema: 
 *                  type: string
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
 *       - ProductCategory
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
 *             $ref: '#/components/schemas/UpdateProductCategorySchema'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProductCategoryUpdated'
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

/**
 * @swagger
 * /productType/{id}:
 *   delete:
 *     summary: Delete a category product by ID
 *     security:
 *       - bearerAuth: []
 *     tags: 
 *       - ProductCategory
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested type of product was deleted.
 *         content: 
 *            text/plain: 
 *                 schema:
 *                    type: string 
 *       400:
 *         description: Missing or invalid product category ID
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


