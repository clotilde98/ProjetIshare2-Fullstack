import vine from '@vinejs/vine';


/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProductTypeSchemaV2:
 *       type: object
 *       properties:
 *         categoryName:
 *           type: string
 */


export const createProductCategorySchema = vine.object({
    categoryName: vine.string().trim(), 
}); 

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProductTypeSchemaV2:
 *       type: object
 *       properties:
 *         categoryName:
 *           type: string
 */

export const updateProductCategorySchema = vine.object({
    categoryName: vine.string().trim(),
}); 


export const productCategoryValidatorV2 = {
    createProductCategoryValidator: vine.compile(createProductCategorySchema),
    updateProductCategoryValidator: vine.compile(updateProductCategorySchema)
}