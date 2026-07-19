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


export const createCategoryProductSchema = vine.object({
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


export const
    createCategoryProductValidator = vine.compile(createCategoryProductSchema),
    updateProductCategoryValidator = vine.compile(updateProductCategorySchema);