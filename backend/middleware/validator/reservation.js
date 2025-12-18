import vine from '@vinejs/vine';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateReservationSchema:
 *       type: object
 *       properties:
 *         postID:
 *           type: integer
 *         reservationStatus:
 *           type: string
 *           enum:
 *             - confirmed
 *             - cancelled
 *       required:
 *         - postID
 *         - reservationStatus
 */


export const createReservationSchema = vine.object({
    postID: vine.number().positive(),
    reservationStatus: vine.enum(['confirmed', 'cancelled']),
}); 

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateReservationSchema:
 *       type: object
 *       properties:
 *         reservationStatus:
 *           type: string
 *           enum:
 *             - confirmed
 *             - cancelled
 */


export const updateReservationSchema = vine.object({
    reservationStatus: vine.enum(['confirmed', 'cancelled']).optional()
});

export const
    createReservationValidator = vine.compile(createReservationSchema),
    updateReservationValidator = vine.compile(updateReservationSchema);