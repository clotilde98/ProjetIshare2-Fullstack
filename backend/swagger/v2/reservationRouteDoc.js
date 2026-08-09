/**
 * @swagger
 * /reservations/me:
 *   get:
 *     summary: The user wants to see their reservations
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - ReservationV2
 *     responses:
 *       200:
 *         $ref: '#/components/responses/MyReservationsResponseV2'
 *       400:
 *         $ref: '#/components/responses/PaginationValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/ObjectNotFound'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /reservations/client/{id}:
 *   get:
 *     summary: Only an administrator can see all the reservations a user has made
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - ReservationV2
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReservationsResponseV2'
 *       400:
 *         description: Invalid client ID or invalid pagination parameters.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/AccessDeniedError'
 *       404:
 *         $ref: '#/components/responses/ObjectNotFound'
 *       500:
 *         description: Server Error
 */


/**
 * @swagger
 * /reservations/post/{id}:
 *   get:
 *     summary: As an administrator, you can see the reservations for a specific post
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - ReservationV2
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReservationsResponseV2'
 *       400:
 *         description: Invalid post ID or invalid pagination parameters.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/AccessDeniedError'
 *       404:
 *         $ref: '#/components/responses/ObjectNotFound'
 *       500:
 *         description: Server error
 */