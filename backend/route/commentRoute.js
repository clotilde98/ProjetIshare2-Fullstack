import { Router } from 'express';
import {checkJWT} from '../middleware/identification/jwt.js'


export const commentRouter = (controller, validator) => {
const router = Router();

router.get('/', checkJWT, controller.getComments);

router.get('/post/:id', checkJWT, controller.getCommentsByPostID);

router.post('/', checkJWT, validator.addCommentValidator, controller.createComment);

router.patch('/:id', checkJWT, validator.updateCommentValidator, controller.updateComment);

router.delete('/:id', checkJWT, controller.deleteComment);


return router;

}
