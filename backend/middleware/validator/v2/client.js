import vine from '@vinejs/vine';

/**
 * @swagger
 * components:
 *   schemas:
 *     refreshTokenSchemaV2:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 */

const refreshTokenSchema = vine.object({
    refreshToken: vine.string().trim()
})

export const
    refreshTokenValidator = vine.compile(refreshTokenSchema);

