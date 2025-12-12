import vine from '@vinejs/vine';

export const createPostSchema = vine.object({
    title: vine.string().trim(),
    description: vine.string().trim(),
    street: vine.string().trim(),
    numberOfPlaces: vine.number().positive(),
    streetNumber: vine.number().positive(), 
    addressID: vine.number().positive(),
    photo: vine.string().trim().optional(), 
    categoriesProduct: vine.string().trim(),
}); 

export const updatePostSchema = vine.object({
    title: vine.string().trim().optional(),
    description: vine.string().trim().optional(),
    street: vine.string().trim().optional(),
    number_of_places: vine.number().positive().optional(),
    number: vine.number().positive().optional(),
    post_status: vine.enum(['available', 'unavailable']).optional(),     
    address_id: vine.number().positive().optional(),
    client_id: vine.number().positive().optional(),
    photo: vine.string().trim().optional(), 
}); 

export const
    createPostValidator = vine.compile(createPostSchema),
    updatePostValidator = vine.compile(updatePostSchema);