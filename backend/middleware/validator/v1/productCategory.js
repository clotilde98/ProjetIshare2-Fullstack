import vine from '@vinejs/vine';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCategoryProductSchema:
 *       type: object
 *       properties:
 *         nameCategory:
 *           type: string
 */


export const createProductCategorySchema = vine.object({
    nameCategory: vine.string().trim(), 
}); 

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCategoryProductSchema:
 *       type: object
 *       properties:
 *         nameCategory:
 *           type: string
 */

export const updateProductCategorySchema = vine.object({
    nameCategory: vine.string().trim(),
}); 


export const productCategoryValidatorV1 = {
    createProductCategoryValidator : vine.compile(createProductCategorySchema),
    updateProductCategoryValidator : vine.compile(updateProductCategorySchema)
}