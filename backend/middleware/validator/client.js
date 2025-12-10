import vine from '@vinejs/vine';


/**
 * 
 * 
 * 
 */

const addClientSchema = vine.object({
    googleId: vine.string().trim().optional(),
    username: vine.string().trim(),
    street : vine.string().trim(),
    streetNumber : vine.number(), 
    photo:vine.string().optional(),
    email: vine.string().email().trim(),
    password: vine.string()
});


/**
 * @swagger
 * components:
 *  schemas:
 *      updateSchema:
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
 *              password: 
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
    isAdmin:vine.boolean().optional()
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
 *       required:
 *         - email
 *         - password
 */

const loginSchema = vine.object({
    email: vine.string().email(),
    password: vine.string().optional(),
    idToken: vine.string().trim().optional(),
    username: vine.string().trim().optional(),
    street : vine.string().trim().optional(),
    streetNumber : vine.number().optional(), 
    photo:vine.string().optional(),
});

export const
    addClientValidator = vine.compile(addClientSchema),
    loginValidator = vine.compile(loginSchema),
    updateClientValidator = vine.compile(updateClientSchema);