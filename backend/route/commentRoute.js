import { Router } from 'express';
import {checkJWT} from '../middleware/identification/jwt.js'
import {getComments, createComment, updateComment, deleteComment} from '../controller/commentController.js';
import {commentValidatorMiddleware} from '../middleware/validation.js';
import {mustBeAdmin} from '../middleware/identification/mustBeAdmin.js'


const router = Router();

router.get('/',checkJWT,mustBeAdmin, getComments);
router.post('/',checkJWT,commentValidatorMiddleware.addCommentValidator,createComment);
router.patch('/:id',checkJWT, mustBeAdmin,commentValidatorMiddleware.updateCommentValidator,updateComment);
router.delete('/:id',checkJWT, mustBeAdmin, deleteComment);


export default router;
