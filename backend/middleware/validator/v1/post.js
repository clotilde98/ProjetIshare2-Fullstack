import vine from '@vinejs/vine';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePostSchema:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         street:
 *           type: string
 *         streetNumber:
 *           type: integer
 *         numberOfPlaces:
 *           type: integer
 *         addressID:
 *           type: integer
 *         categoriesProduct:
 *           type: string
 *       required:
 *         - title
 *         - description
 *         - street
 *         - streetNumber
 *         - numberOfPlaces
 *         - addressID
 *         - categoriesProduct
 */



export const createPostSchema = vine.object({
    title: vine.string().maxLength(50).trim(),
    description: vine.string().maxLength(255).trim(),
    street: vine.string().maxLength(100).trim(),
    numberOfPlaces: vine.number().positive(),
    streetNumber: vine.number().positive(), 
    addressID: vine.number().positive().withoutDecimals(),
    categoriesProduct: vine.string().trim(),
}); 

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePostSchema:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         street:
 *           type: string
 *         streetNumber:
 *           type: integer
 *         numberOfPlaces:
 *           type: integer
 *         postStatus:
 *           type: string
 *           enum:
 *             - available
 *             - unavailable
 *         categoriesProduct:
 *           type: string
 *       required: 
 *           - categoriesProduct        
 */


export const updatePostSchema = vine.object({
    title: vine.string().maxLength(50).trim().optional(),
    description: vine.string().maxLength(255).trim().optional(),
    street: vine.string().trim().maxLength(100).optional(),
    numberOfPlaces: vine.number().positive().optional(),
    streetNumber: vine.number().positive().optional(),
    postStatus: vine.enum(['available', 'unavailable']).optional(),     
    addressID: vine.number().positive().withoutDecimals().optional(),
    categoriesProduct: vine.string().trim(), 
    
}); 


export const
    createPostValidator = vine.compile(createPostSchema),
    updatePostValidator = vine.compile(updatePostSchema);