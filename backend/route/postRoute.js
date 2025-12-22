import { Router } from 'express';
import {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  searchPostByCategory
} from '../controller/postController.js';

import {checkJWT} from '../middleware/identification/jwt.js'
import {postValidatorMiddleware} from '../middleware/validation.js';
import {upload} from '../middleware/upload.js';


const router = Router();

/**
 * @swagger
 * /posts/: 
 *   post: 
 *     summary: Whether they are an administrator or a user, they can create a post and send confirmation of its creation.
 *     security: 
 *        - bearerAuth: [] 
 *     tags: 
 *       - Post
 *     requestBody:
 *       required: true
 *       content: 
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/CreatePostSchema'
 *               - type: object
 *                 properties:
 *                   photo:
 *                     type: string
 *                     format: binary
 *     responses: 
 *       201: 
 *         $ref: '#/components/responses/PostResponse'
 *       400: 
 *         description: Validation error OR Post category missing
 *         content: 
 *            text/Plain: 
 *                schema: 
 *                    type: string 
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403: 
 *         $ref: '#/components/responses/AccessDeniedError'
 *       404: 
 *         $ref: '#/components/responses/ObjectNotFound'
 *       500: 
 *         description: Server error
 */

router.post("/", checkJWT, upload.single('photo'), postValidatorMiddleware.createPostValidator, createPost);  

/**
 * @swagger
 * /byCategory:
 *   get:
 *     summary: Retrieve posts by category
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Post
 *     parameters:
 *       - name: nameCategory
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AllPostByCategory'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 */


router.get("/byCategory", checkJWT, searchPostByCategory); 

/**
 * @swagger
 * /posts/:
 *   get:
 *     summary: Get posts with filters
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Post
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: postStatus
 *         required: true
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AllPostsRead'
 *       400: 
 *         description: The requested page and its limit must both be a number.
 *         content: 
 *            text/plain: 
 *                schema: 
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server Error
 */




router.get("/", checkJWT, getPosts); 

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Return an existing post using the received ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     tags:
 *       - Post
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PostResponse'
 *       400:
 *         description:  Invalid post ID
 *         content: 
 *            text/plain: 
 *                 schema:
 *                    type: string 
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/ObjectNotFound'
 *       500:
 *         description: Server error 
 */



router.get("/:id", checkJWT, getPost);  

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Updates an existing post with the option to upload a file.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref:  '#/components/schemas/UpdatePostSchema'
 *               - type: object
 *                 properties:
 *                   photo:
 *                     type: string
 *                     format: binary
 *     tags:
 *       - Post
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PostResponse'
 *       400:
 *         description: Validation error OR Post category missing
 *         content: 
 *            text/Plain: 
 *                schema: 
 *                    type: string 
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/AccessDeniedError'
 *       404:
 *         $ref: '#/components/responses/ObjectNotFound'
 *       500:
 *         description: Server error
 */


router.patch("/:id", checkJWT, upload.single('photo'), postValidatorMiddleware.updatePostValidator, updatePost);  

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post using the ID
 *     security:
 *       - bearerAuth: []
 *     tags: 
 *       - Post
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested post has been deleted.
 *         content: 
 *            text/plain: 
 *                 schema:
 *                    type: string 
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


router.delete("/:id", checkJWT, deletePost);      

export default router;
