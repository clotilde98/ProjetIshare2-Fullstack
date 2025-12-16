import vine from '@vinejs/vine';

export const createReservationSchema = vine.object({
    postID: vine.number().positive(),
}); 

export const updateReservationSchema = vine.object({
    reservationStatus: vine.enum(['confirmed', 'cancelled']).optional(),
    id: vine.number().positive().optional(),
});

export const
    createReservationValidator = vine.compile(createReservationSchema),
    updateReservationValidator = vine.compile(updateReservationSchema);