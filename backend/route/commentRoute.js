import { Router } from 'express';
import {checkJWT} from '../middleware/identification/jwt.js'
import {getComments, createComment, updateComment, deleteComment} from '../controller/commentController.js';
import {commentValidatorMiddleware} from '../middleware/validation.js';

const router = Router();


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
 *         $ref: '#/components/responses/CommentsRead'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 */


router.get('/', checkJWT, getComments);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Add a comment
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentSchema'
 *     responses:
 *       201:
 *         $ref: "#/components/responses/CommentAdded"
 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       500:
 *         description: Server error
 */


router.post('/', checkJWT, commentValidatorMiddleware.addCommentValidator, createComment);

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: An administrator updates a comment
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Comment
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommentSchema'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentUpdated'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/AccessDeniedError'
 *       404:
 *         $ref: '#/components/responses/ObjectNotFound'
 *       500:
 *         description: Server error
 */


router.patch('/:id', checkJWT, commentValidatorMiddleware.updateCommentValidator, updateComment);

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
 *          200:
 *            description: The comment has been deleted from the database
 *            content: 
 *              text/plain: 
 *                 schema:
 *                    type: string 
 *          401:
 *            $ref: '#/components/responses/UnauthorizedError'
 *          403: 
 *            $ref: '#/components/responses/AccessDeniedError'
 *          404:
 *            $ref: '#/components/responses/ObjectNotFound'
 *          500:
 *            description: Server error  
 */

router.delete('/:id', checkJWT, deleteComment);


export default router;
