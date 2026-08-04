/**
 * @swagger
 * /comments/:
 *   get:
 *     summary: Retrieve a list of comments
 *     parameters:
 *       - name: commentDate
 *         in: query
 *         required: false
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
 *       - CommentV2
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentsReadV2'
 *       400: 
 *         $ref: '#/components/responses/PaginationValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Retrieve a list the comment by post ID 
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID of the comments
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - CommentV2
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentsReadV2'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 * 
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Add a comment
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - CommentV2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentSchemaV2'
 *     responses:
 *       201:
 *         $ref: "#/components/responses/CommentAddedV2"
 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: An administrator updates a comment
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - CommentV2
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
 *         $ref: '#/components/responses/CommentUpdatedV2'
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