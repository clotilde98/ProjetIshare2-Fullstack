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
 *       required:
 *         - postID
 */


export const createReservationSchema = vine.object({
    postID: vine.number().positive(),
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
 *             - withdrawal
 */



export const updateReservationSchema = vine.object({
    reservationStatus: vine.enum(['confirmed', 'cancelled','withdrawal']).optional(), 
});

export const
    createReservationValidator = vine.compile(createReservationSchema),
    updateReservationValidator = vine.compile(updateReservationSchema);