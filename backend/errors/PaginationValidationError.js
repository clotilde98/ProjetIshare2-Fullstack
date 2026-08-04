/**
 * @swagger
 * components:
 *    responses: 
 *      PaginationValidationError: 
 *        description: Invalid pagination parameters
 *        content: 
 *          application/json: 
 *            schema: 
 *              type: object
 *              properties: 
 *                error: 
 *                  type: string
 */

export class PaginationValidationError extends Error {
    constructor(message){
        super(message); 
    }
}