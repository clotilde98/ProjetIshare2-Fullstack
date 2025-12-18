import vine from '@vinejs/vine';

/**
 * @swagger
 * components: 
 *   schemas: 
 *      CreatePostSchema: 
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
 *           type: array 
 *           items: 
 *             type: number 
 *             minimum: 1
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
    categoriesProduct: vine.array(vine.number().positive())
}); 

/**
 * @swagger 
 * components:
 *  schemas: 
 *      UpdatePostSchema: 
 *          type: object
 *          properties: 
 *              title: 
 *                  type: string 
 *              description: 
 *                  type: string
 *              street: 
 *                  type: string 
 *              streetNumber:
 *                  type: integer
 *              numberOfPlaces: 
 *                  type: integer
 *              postStatus: 
 *                  type: string 
 *                  enum: 
 *                     - available 
 *                     - unavailable
 */


export const updatePostSchema = vine.object({
    title: vine.string().trim().optional(),
    description: vine.string().trim().optional(),
    street: vine.string().trim().optional(),
    number_of_places: vine.number().positive().optional(),
    streetNumber: vine.number().positive().optional(),
    post_status: vine.enum(['available', 'unavailable']).optional(),     
    address_id: vine.number().positive().optional(),
    client_id: vine.number().positive().optional(), 
}); 

export const
    createPostValidator = vine.compile(createPostSchema),
    updatePostValidator = vine.compile(updatePostSchema);