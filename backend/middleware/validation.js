import { addClientValidator, loginValidator, updateClientValidator } from "./validator/v1/client.js"; 
import { refreshTokenValidator } from "./validator/v2/client.js"; 
import {commentValidatorV1 } from "./validator/v1/comment.js";
import { addCommentValidatorV2 } from "./validator/v2/comment.js";
import { createPostValidator, updatePostValidator } from "./validator/v1/post.js";
import { createReservationValidator, updateReservationValidator } from "./validator/v1/reservation.js";
import { productCategoryValidatorV1 } from "./validator/v1/productCategory.js";
import { productCategoryValidatorV2 } from "./validator/v2/productCategory.js";

/**
 * @swagger
 * components:
 *  responses:
 *      ValidationError:
 *          description: the error(s) returned by Vine
 *          content:
 *              text/plain:
 *                  schema:
 *                      type: string
 */

export const clientValidatorMiddleware1 = {
    addClientValidator: async (req, res, next) => {
        try {
            req.body = await addClientValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.message);
        }
    },
    loginValidator : async (req, res, next) => {
        try {
            req.body = await loginValidator.validate(req.body);
            next();
        } catch (e){
            res.status(400).send(e.message);
        }
    },
    updateClientValidator: async (req, res, next) => {
        try {
            req.body = await updateClientValidator.validate(req.body);
            next();
        } catch (e){
            res.status(400).send(e.message);
        }
    }
    
};

export const clientValidatorMiddleware2 = {
    loginValidator : async (req, res, next) => {
        try {
            req.body = await loginValidator.validate(req.body);
            next();
        } catch (e){
            res.status(400).send(e.message);
        }
    },
    refreshTokenValidator: async (req, res, next) => {
        try {
            req.body = await refreshTokenValidator.validate(req.body);
            next();
        } catch (e){
            res.status(400).send(e.message);
        }
    }
};



export const commentValidatorMiddleware1 = {
    addCommentValidator: async (req, res, next) => {
        try {
            req.body = await commentValidatorV1.addCommentValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    },
    updateCommentValidator: async (req, res, next) => {
        try {
            req.body = await commentValidatorV1.updateCommentValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    }
};

export const commentValidatorMiddleware2 = {
    addCommentValidator: async (req, res, next) => {
        try {
            req.body = await addCommentValidatorV2.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    },
    updateCommentValidator: async (req, res, next) => {
        try {
            req.body = await commentValidatorV1.updateCommentValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    }
};


export const postValidatorMiddleware = {
    createPostValidator: async (req, res, next) => {
        try {
            req.body = await createPostValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    },
    updatePostValidator: async (req, res, next) => {
        try {
            req.body = await updatePostValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    }
};



export const reservationValidatorMiddleware = {
    createReservationValidator: async (req, res, next) => {
        try {
            req.body = await createReservationValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    },
    updateReservationValidator: async (req, res, next) => {
        try {
            req.body = await updateReservationValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    }
};



export const productCategoryValidatorMiddleware1 = {
    createProductCategoryValidator: async (req, res, next) => {
        try {
            req.body = await productCategoryValidatorV1.createProductCategoryValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    },
    updateProductCategoryValidator: async (req, res, next) => {
        try {
            req.body = await productCategoryValidatorV1.updateProductCategoryValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    }
};

export const productCategoryValidatorMiddleware2 = {
    createProductCategoryValidator: async (req, res, next) => {
        try {
            req.body = await productCategoryValidatorV2.createProductCategoryValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    },
    updateProductCategoryValidator: async (req, res, next) => {
        try {
            req.body = await productCategoryValidatorV2.updateProductCategoryValidator.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    }
};