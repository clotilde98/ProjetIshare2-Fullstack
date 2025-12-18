import Router from 'express';
import {getCategories, createTypeProduct, updateTypeProduct, deleteTypeProduct} from '../controller/productTypeController.js';
import {checkJWT} from '../middleware/identification/jwt.js'
import {mustBeAdmin} from '../middleware/identification/mustBeAdmin.js'
import {categoryProductValidatorMiddleware} from '../middleware/validation.js';


const router = Router();

/**
 * @swagger
 * /productType:
 *   post:
 *     summary: An administrator can create a category type
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - ProductType
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryProductSchema'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CategoryProductCreated'
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


router.post('/', checkJWT,mustBeAdmin,categoryProductValidatorMiddleware.createCategoryProductValidator,createTypeProduct);
/**
 * @swagger
 * /productType/:
 *   get:
 *     summary: Get categories filtered by name
 *     security:
 *       - bearerAuth: []
 *     tags: 
 *       - ProductType
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
 *       201:
 *         $ref: '#/components/responses/CategoryReaded'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal server error
 */


router.get('/',checkJWT, getCategories);


/**
 * @swagger
 * /productType/{id}:
 *   patch:
 *     summary: Only an administrator can modify a product category
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - ProductType
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
 *             $ref: '#/components/schemas/UpdateCategoryProductSchema'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReservationResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/AccessDeniedError'
 *       404:
 *         $ref: '#/components/responses/ObjectNotFound'
 *       500:
 *         description: Server error
 */


router.patch('/:id',checkJWT,mustBeAdmin,categoryProductValidatorMiddleware.updateCategoryProductValidator, updateTypeProduct);

/**
 * @swagger
 * /productType/{id}:
 *   delete:
 *     summary: Delete a category product by ID
 *     security:
 *       - bearerAuth: []
 *     tags: 
 *       - ProductType
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: The requested type of product was deleted.
 *         content: 
 *            text/plain: 
 *                 schema:
 *                    type: string 
 *       400:
 *         description: Missing product category ID
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


router.delete('/:id',checkJWT,mustBeAdmin, deleteTypeProduct);


export default router;

