import vine from '@vinejs/vine';


export const createCommentSchema = vine.object({
    content: vine.string().trim(), 
    idPost: vine.number().positive(),
    idCostumer: vine.number().positive(), 
    
}); 

export const updateCommentSchema = vine.object({
    content: vine.string().trim().optional(),
    
}); 


export const
    addCommentValidator = vine.compile(createCommentSchema),
    updateCommentValidator = vine.compile(updateCommentSchema);
