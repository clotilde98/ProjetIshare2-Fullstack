import { addClientValidator, loginValidator, updateClientValidator } from "./validator/client.js"; 
import { addCommentValidator, updateCommentValidator } from "./validator/comment.js";
import { createPostValidator, updatePostValidator } from "./validator/post.js";
import { createReservationValidator, updateReservationValidator } from "./validator/reservation.js";
import { createCategoryProductValidator, updateCategoryProductValidator } from "./validator/categoryProduct.js";

/**
 * @swagger
 * components:
 *  responses:
 *      ValidationError:
 *          description: the error(s) described
 *          content:
 *              text/plain:
 *                  schema:
 *                      type: string
 */


export const clientValidatorMiddleware = {
    addClientValidator: async (req, res, next) => {
        try {
            req.val = await addClientValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.message);
        }
    },
    loginValidator : async (req, res, next) => {
        try {
            req.val = await loginValidator.validate(req.body);
            next();
        } catch (e){
            res.status(400).send(e.message);
        }
    },
    updateClientValidator: async (req, res, next) => {
        try {
            req.val = await updateClientValidator.validate(req.body);
            next();
        } catch (e){
            res.status(400).send(e.message);
        }
    }
    
};



export const commentValidatorMiddleware = {
    addCommentValidator: async (req, res, next) => {
        try {
            req.val = await addCommentValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    },
    updateCommentValidator: async (req, res, next) => {
        try {
            req.val = await updateCommentValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    }
};


export const postValidatorMiddleware = {
    createPostValidator: async (req, res, next) => {
        try {
            req.val = await createPostValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    },
    updatePostValidator: async (req, res, next) => {
        try {
            req.val = await updatePostValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    }
};



export const reservationValidatorMiddleware = {
    createReservationValidator: async (req, res, next) => {
        try {
            req.val = await createReservationValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    },
    updateReservationValidator: async (req, res, next) => {
        try {
            req.val = await updateReservationValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    }
};



export const categoryProductValidatorMiddleware = {
    createCategoryProductValidator: async (req, res, next) => {
        try {
            req.val = await createCategoryProductValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    },
    updateCategoryProductValidator: async (req, res, next) => {
        try {
            req.val = await updateCategoryProductValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    }
};