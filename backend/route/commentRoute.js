import { Router } from 'express';
import {checkJWT} from '../middleware/identification/jwt.js'
import {getComments, createComment, updateComment, deleteComment} from '../controller/commentController.js';
import {commentValidatorMiddleware} from '../middleware/validation.js';
import {mustBeAdmin} from '../middleware/identification/mustBeAdmin.js'
<<<<<<< HEAD
import { orMiddleware } from '../middleware/utils/orMiddleware.js';
=======
import { orMiddleware} from '../middleware/utils/orMiddleware.js';
>>>>>>> 4c6f223dde37bad8a8731b887a65e664194c1273
import { isSameUser } from '../middleware/identification/user.js';


const router = Router();

<<<<<<< HEAD
router.get('/', checkJWT, getComments);
router.post('/', checkJWT, commentValidatorMiddleware.addCommentValidator, createComment);
router.patch('/:id', checkJWT, commentValidatorMiddleware.updateCommentValidator, updateComment);
router.delete('/:id', checkJWT, deleteComment);
=======
/**
 * @swagger
 * /comments/:
 *   get:
 *     summary: Retrieve a list of comments
 *     parameters:
 *       - name: commentDate
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter comments by date (optional)
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of comments per page
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Comment
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentsReaded'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 */



router.get('/',checkJWT,mustBeAdmin, getComments);

/**
 * @swagger
 * /comments/: 
 *  post: 
 *      summary: Add a comment 
 *      security: 
 *          - bearerAuth: []
 *      tags: 
 *          - Comment
 *      requestBody: 
 *         content: 
 *              application/json: 
 *                 schema: 
 *                  $ref: '#/components/schemas/createCommentSchema'
 *      
 *      responses: 
 *         200: 
 *          $ref: "#/components/responses/CommentAdded"
 *         400: 
 *          $ref: "#/components/responses/ValidationError"
 *         401: 
 *          $ref: "#/components/responses/UnauthorizedError"
 *         500: 
 *          description: Server error      
 * 
 */




router.post('/',checkJWT,commentValidatorMiddleware.addCommentValidator,createComment);

/**
 * @swagger
 * /comments/{id}: 
 *   patch: 
 *      summary: An administrator updates a comment
 *      security: 
 *          - bearerAuth: []
 *      tags: 
 *          - Comment
 *      parameters: 
 *          - name: id 
 *            in: path 
 *            required: true 
 *            schema: 
 *              type: integer
 * 
 *      requestBody:
 *           content: 
 *              application/json: 
 *                  schema: 
 *                     $ref: '#/components/schemas/updateCommentSchema'
 *      responses: 
 *         200:
 *           $ref: '#/components/responses/CommentUpdated'
 *         400: 
 *           $ref: '#/components/responses/ValidationError'
 *         401: 
 *           $ref: '#/components/responses/UnauthorizedError'
 *         404: 
 *           $ref: '#/components/responses/CommentNotFound'
 *         500: 
 *           description: Server error 
 *   
 */



router.patch('/:id',checkJWT, mustBeAdmin,commentValidatorMiddleware.updateCommentValidator,updateComment);

/**
 * @swagger
 * /comments/{id}:
 *  delete:
 *      summary: An administrator deletes a comment
 *      description: Delete a specific comment 
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Comment
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: ID of the comment to delete
 *            schema:
 *                type: integer
 *              
 *      responses:
 *          204:
 *            $ref: '#/components/responses/CommentDeleted'
 *          401:
 *            $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *            $ref: '#/components/responses/CommentNotFound'
 *          500:
 *            description: Server error
 *  
 */


router.delete('/:id', orMiddleware(mustBeAdmin, isSameUser),checkJWT, deleteComment);
>>>>>>> 4c6f223dde37bad8a8731b887a65e664194c1273


export default router;
