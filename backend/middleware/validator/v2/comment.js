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
    content: vine.string().trim(), 
    postID : vine.number().positive(),
    clientID: vine.number().positive().optional()
}); 

export const addCommentValidatorV2 = vine.compile(createCommentSchema);