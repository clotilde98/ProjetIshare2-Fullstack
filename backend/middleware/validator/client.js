import vine from '@vinejs/vine';


/**
 * @swagger
 * components: 
 *  schemas: 
 *      AddClientSchema: 
 *              type: object 
 *              properties: 
 *                  googleId: 
 *                      type: string  
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
 *                  - steetNumber 
 *                  - email
 *                  - password 
 * 
 */

const addClientSchema = vine.object({
    username: vine.string().trim(),
    street : vine.string().trim(),
    streetNumber : vine.number(), 
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
 *              photo:
 *                  type: string 
 *              oldPpassword: 
 *                  type: string 
 *              newPassord: 
 *                  type: string
 *              isAdmin:
 *                  type: boolean
 */             
            



const updateClientSchema =  vine.object({
    username: vine.string().trim().optional(),
    street : vine.string().trim().optional(),
    streetNumber : vine.number().optional(), 
    photo:vine.string().optional(),
    password: vine.string().optional(), 
    oldPassword: vine.string().optional(),
}); 
 

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginSchema:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 */

const loginSchema = vine.object({
    email: vine.string().email(),
    password: vine.string().optional(),
});

export const
    addClientValidator = vine.compile(addClientSchema),
    loginValidator = vine.compile(loginSchema),
    updateClientValidator = vine.compile(updateClientSchema);