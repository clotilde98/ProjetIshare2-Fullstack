import vine from '@vinejs/vine';

/**
 * @swagger
 * components:
 *   schemas:
 *     createCommentSchema:
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
    idCustomer: vine.number().positive(), 
    
}); 

/**
 * @swagger
 * components:
 *   schemas:
 *     updateCommentSchema:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *       
 */


export const updateCommentSchema = vine.object({
    content: vine.string().trim().optional(),
    
}); 


export const
    addCommentValidator = vine.compile(createCommentSchema),
    updateCommentValidator = vine.compile(updateCommentSchema);
