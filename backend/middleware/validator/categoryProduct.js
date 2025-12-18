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


export const updateCategoryProductSchema = vine.object({
    nameCategory: vine.string().trim(),
    
}); 


export const
    createCategoryProductValidator = vine.compile(createCategoryProductSchema),
    updateCategoryProductValidator = vine.compile(updateCategoryProductSchema);