import vine from '@vinejs/vine';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProductCategorySchema:
 *       type: object
 *       properties:
 *         nameCategory:
 *           type: string
 */


export const createProductCategorySchema = vine.object({
    nameCategory: vine.string().trim().maxLength(20), 
}); 

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProductCategorySchema:
 *       type: object
 *       properties:
 *         nameCategory:
 *           type: string
 */

export const updateProductCategorySchema = vine.object({
    nameCategory: vine.string().trim().maxLength(20),
}); 


export const productCategoryValidatorV1 = {
    createProductCategoryValidator : vine.compile(createProductCategorySchema),
    updateProductCategoryValidator : vine.compile(updateProductCategorySchema)
}