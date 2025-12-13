import { Router } from 'express';
import {checkJWT} from '../middleware/identification/jwt.js'
import {getComments, createComment, updateComment, deleteComment} from '../controller/commentController.js';
import {commentValidatorMiddleware} from '../middleware/validation.js';



const router = Router();

router.get('/', checkJWT, getComments);
router.post('/', checkJWT, commentValidatorMiddleware.addCommentValidator, createComment);
router.patch('/:id', checkJWT, commentValidatorMiddleware.updateCommentValidator, updateComment);
router.delete('/:id', checkJWT, deleteComment);


export default router;
