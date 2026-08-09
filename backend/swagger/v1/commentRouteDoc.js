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
 *       - Comment
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentsRead'
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
 *       - Comment
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CommentsByPostID'
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
 *       403: 
 *         $ref: "#/components/responses/AccessDeniedError"
 *       404: 
 *         $ref: "#/components/responses/ObjectNotFound"         
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: An user updates his comment or an administrator updates a comment
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
 *         description: Invalid user ID or validation error (body)
 *         content: 
 *           text/plain: 
 *               schema:
 *                  type: string
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
 * /comments/{id}:
 *  delete:
 *      summary: An administrator deletes a comment or a user deletes his comment
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
 *          400: 
 *            description: Invalid comment ID
 *            content: 
 *              text/plain: 
 *                 schema:
 *                  type: string
 *          401:
 *            $ref: '#/components/responses/UnauthorizedError'
 *          403: 
 *            $ref: '#/components/responses/AccessDeniedError'
 *          404:
 *            $ref: '#/components/responses/ObjectNotFound'
 *          500:
 *            description: Server error  
 */
