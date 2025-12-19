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
    title: vine.string().trim(),
    description: vine.string().trim(),
    street: vine.string().trim(),
    numberOfPlaces: vine.number().positive(),
    streetNumber: vine.number().positive(), 
    addressID: vine.number().positive(),
    photo: vine.string().trim().optional(), 
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
 */




export const updatePostSchema = vine.object({
    title: vine.string().trim().optional(),
    description: vine.string().trim().optional(),
    street: vine.string().trim().optional(),
    number_of_places: vine.number().positive().optional(),
    number: vine.number().positive().optional(),
    post_status: vine.enum(['available', 'unavailable']).optional(),     
    address_id: vine.number().positive().optional(),
    client_id: vine.number().positive().optional(),
    photo: vine.string().trim().optional(), 
    categoriesProduct: vine.string().trim().optional(), 
    
}); 


export const
    createPostValidator = vine.compile(createPostSchema),
    updatePostValidator = vine.compile(updatePostSchema);