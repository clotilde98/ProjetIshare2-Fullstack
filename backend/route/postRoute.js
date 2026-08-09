import { Router } from 'express';
import {checkJWT} from '../middleware/identification/jwt.js'; 
import {postValidatorMiddleware} from '../middleware/validation.js';
import {upload} from '../middleware/upload.js';

export const postRouter = (controller) => {
const router = Router();

router.post("/", checkJWT, upload.single('photo'), postValidatorMiddleware.createPostValidator, controller.createPost);  

router.get("/byCategory", checkJWT, controller.searchPostsByCategory); 

router.get("/", checkJWT, controller.getPosts); 

router.get("/:id", checkJWT, controller.getPost);  

router.patch("/:id", checkJWT, upload.single('photo'), postValidatorMiddleware.updatePostValidator, controller.updatePost);  

router.delete("/:id", checkJWT, controller.deletePost); 

router.delete("/:id/image", checkJWT, controller.deleteImageFromPost); 

return router;
}
