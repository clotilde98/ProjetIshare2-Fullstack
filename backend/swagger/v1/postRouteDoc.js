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
 *         $ref: '#/components/responses/PostCreated'
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
 *         $ref: '#/components/responses/PaginationValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server Error
 */

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
 *         $ref: '#/components/responses/PostUptated'
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

/**
 * @swagger
 * /posts/{id}/image:
 *   delete:
 *     summary: Delete an image from a post ID
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
 *         description: The image from the requested post has been deleted.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
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


