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
 *              required: 
 *                  - username
 *                  - street
 *                  - streetNumber 
 *                  - email
 *                  - password 
 * 
 */


const addClientSchema = vine.object({
    email: vine.string().email().trim(),
    password: vine.string()
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
 *              oldPpassword: 
 *                  type: string 
 *              password: 
 *                  type: string
 *              isAdmin:
 *                  type: boolean
 */             
            

const updateClientSchema =  vine.object({
    username: vine.string().trim().optional(),
    street: vine.string().trim().optional(),
    streetNumber: vine.string().optional(), 
    addressID: vine.number().optional(),
    password: vine.string().optional(), 
    oldPassword: vine.string().optional(),
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