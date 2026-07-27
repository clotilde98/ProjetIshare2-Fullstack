import vine from '@vinejs/vine';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCommentSchema:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *         idPost:
 *           type: integer
 *         idCustomer:
 *           type: integer
 *       required:
 *         - content
 *         - idPost
 *         - idCustomer
 */


export const createCommentSchema = vine.object({
    content: vine.string().trim(), 
    idPost: vine.number().positive(),
    idCustomer: vine.number().positive().optional()
}); 

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCommentSchema:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *       
 */


export const updateCommentSchema = vine.object({
    content: vine.string().trim().optional(),
    
}); 


export const commentValidatorV1 = {
    addCommentValidator : vine.compile(createCommentSchema),
    updateCommentValidator : vine.compile(updateCommentSchema)
}