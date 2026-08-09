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
 */


export const createCommentSchema = vine.object({
    content: vine.string().trim().maxLength(300), 
    idPost: vine.number().positive().withoutDecimals(),
    idCustomer: vine.number().positive().withoutDecimals().optional()
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
    content: vine.string().trim().maxLength(300).optional(),
    
}); 


export const commentValidatorV1 = {
    addCommentValidator : vine.compile(createCommentSchema),
    updateCommentValidator : vine.compile(updateCommentSchema)
}