import vine from '@vinejs/vine';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCommentSchemaV2:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *         postID:
 *           type: integer
 *         clientID:
 *           type: integer
 *       required:
 *         - content
 *         - postID
 *         - clientID
 */


export const createCommentSchema = vine.object({
    content: vine.string().trim().maxLength(300), 
    postID : vine.number().positive(),
    clientID: vine.number().positive().optional()
}); 

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCommentSchemaV2:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *       
 */

export const addCommentValidatorV2 = vine.compile(createCommentSchema);