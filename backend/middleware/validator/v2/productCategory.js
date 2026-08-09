import vine from '@vinejs/vine';


/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProductCategorySchemaV2:
 *       type: object
 *       properties:
 *         categoryName:
 *           type: string
 */


export const createProductCategorySchema = vine.object({
    categoryName: vine.string().trim().maxLength(20), 
}); 

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProductCategorySchemaV2:
 *       type: object
 *       properties:
 *         categoryName:
 *           type: string
 */

export const updateProductCategorySchema = vine.object({
    categoryName: vine.string().trim().maxLength(20),
}); 


export const productCategoryValidatorV2 = {
    createProductCategoryValidator: vine.compile(createProductCategorySchema),
    updateProductCategoryValidator: vine.compile(updateProductCategorySchema)
}