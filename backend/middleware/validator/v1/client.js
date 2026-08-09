import vine from '@vinejs/vine';

/**
 * @swagger
 * components: 
 *  schemas: 
 *      AddClientSchema: 
 *              type: object 
 *              properties:   
 *                  username: 
 *                      type: string 
 *                  street: 
 *                      type: string
 *                  streetNumber: 
 *                      type: integer
 *                  email: 
 *                      type: string
 *                  password: 
 *                      type: string
 *                  addressID:
 *                      type: integer
 *                  isAdmin: 
 *                      type: boolean
 *              required: 
 *                  - username
 *                  - street
 *                  - streetNumber 
 *                  - email
 *                  - password 
 * 
 */


const addClientSchema = vine.object({
    email: vine.string().email().maxLength(100).trim(),
    password: vine.string(), 
    username: vine.string().trim().maxLength(50).optional(), 
    street: vine.string().trim(),
    streetNumber: vine.number(),
    addressID: vine.number().optional(), 
    isAdmin: vine.boolean().optional()
    
});

/**
 * @swagger
 * components:
 *  schemas:
 *      UpdateSchema:
 *          type: object
 *          properties:
 *              username:
 *                  type: string 
 *              street: 
 *                  type: string
 *              streetNumber: 
 *                  type: integer
 *              oldPassword: 
 *                  type: string 
 *              password: 
 *                  type: string
 *              isAdmin:
 *                  type: boolean
 */             
            

const updateClientSchema =  vine.object({
    username: vine.string().trim().maxLength(50).optional(),
    street: vine.string().trim().maxLength(100).optional(),
    streetNumber: vine.string().optional(), 
    addressID: vine.number().optional(),
    password: vine.string().maxLength(255).optional(), 
    oldPassword: vine.string().maxLength(255).optional(),
    isAdmin: vine.boolean().optional()
}); 

/**
 * @swagger
 * components:
 *   schemas:
 *     loginSchema:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         idToken: 
 *           type: string
 *       required:
 *         - email
 *         
 */

const loginSchema = vine.object({
    email: vine.string().email().optional(),
    password: vine.string().optional(),
    idToken: vine.string().trim().optional(),
});


export const
    addClientValidator = vine.compile(addClientSchema),
    loginValidator = vine.compile(loginSchema),
    updateClientValidator = vine.compile(updateClientSchema);