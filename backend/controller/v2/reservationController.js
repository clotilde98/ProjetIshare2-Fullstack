import { pool } from "../../database/database.js";
import {readPost} from '../../model/v1/postDB.js'
import * as reservationModel from '../../model/v2/reservationDB.js';
import { PAGINATION } from '../../Config/pagination.js';
import {validatePagination} from '../../Utils/validationPagination.js'; 
import { PaginationValidationError } from "../../errors/PaginationValidationError.js"; 
import { getUserById } from "../../model/v1/client.js";  

/**
 * @swagger
 * components:
 *   schemas:
 *     ReservationV2:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         reservation_date:
 *           type: string
 *           format: date
 *         reservation_status:
 *           type: string
 *         post_id:
 *           type: integer
 *         client_id:
 *           type: integer
 *
 *     ReservationsListV2:
 *       type: object
 *       properties:
 *         rows:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReservationV2'
 *         total:
 *           type: integer
 *           description: Total number of reservations matching the search criteria
 */

/**
 * @swagger
 * components:
 *   responses:
 *     MyReservationsResponseV2:
 *       description: Reservations matching the specified user ID.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationsListV2'
 */

export const getMyReservations = async (req, res) => {
    try {
        let userID = req.user.id;

        const {page, limit} = req.query; 

        const limitResult = validatePagination(limit, PAGINATION.DEFAULT_LIMIT, PAGINATION.MIN_LIMIT, PAGINATION.MAX_LIMIT, 'limit');
        const pageResult  = validatePagination(page, PAGINATION.DEFAULT_PAGE, PAGINATION.MIN_LIMIT, PAGINATION.MAX_LIMIT, 'page');  

        const reservations = await reservationModel.readReservationsByClientID(pool, {
            id : userID, 
            page : pageResult, 
            limit : limitResult
        });
        if (reservations.total > 0){
            res.status(200).send({reservations});
        } else {
            res.status(404).send("Client reservation not found");
        }

    } catch (err){
        if(err instanceof PaginationValidationError){
            return res.status(400).json({error : err.message}); 
        }
        console.error("Internal server error", err); 
        res.status(500).send("Internal server error"); 
    }
}

/**
 * @swagger
 * components:
 *   responses:
 *     ReservationsResponseV2:
 *       description: All reservations matching the specified ID parameters.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationsListV2'
 */

export const getReservationsByClientID = async (req, res) => {
    try {
        const clientID = Number(req.params.id);
        if(!Number.isInteger(clientID) || clientID <= 0) return res.status(400).send("Invalid client ID");

        const { page, limit} = req.query; 

        const limitResult = validatePagination(limit, PAGINATION.DEFAULT_LIMIT, PAGINATION.MIN_LIMIT, PAGINATION.MAX_LIMIT, 'limit');
        const pageResult  = validatePagination(page, PAGINATION.DEFAULT_PAGE, PAGINATION.MIN_LIMIT, PAGINATION.MAX_LIMIT, 'page');  

        const reservations = await reservationModel.readReservationsByClientID(pool, {id : clientID, page : pageResult, limit : limitResult});
    
        res.status(200).send({reservations});

    } catch (err) {
        if(err instanceof PaginationValidationError){
            return res.status(400).json({error : err.message}); 
        }
        console.error("Internal server error", err); 
        res.status(500).send("Internal server error"); 
    }
}


export const getReservationsByPostID = async (req, res) => {
    try {
        const postID = Number(req.params.id);
        if(!Number.isInteger(postID) || postID <= 0) return res.status(400).send("Invalid post ID");

        const {page, limit} = req.query; 

        const limitResult = validatePagination(limit, PAGINATION.DEFAULT_LIMIT, PAGINATION.MIN_LIMIT, PAGINATION.MAX_LIMIT, 'limit');
        const pageResult  = validatePagination(page, PAGINATION.DEFAULT_PAGE, PAGINATION.MIN_LIMIT, PAGINATION.MAX_LIMIT, 'page'); 

        const post = await readPost(pool, postID);
        if (!post) return res.status(404).send("Post doesn't exist");

        if (post.client_id !== req.user.id && !req.user.isAdmin) return res.status(403).send("Admin privilege required");


        const reservations = await reservationModel.readReservationsByPostID(pool, {id : postID, page : pageResult, limit : limitResult})

        res.status(200).send({reservations});
        
        
    } catch (err) {
        if(err instanceof PaginationValidationError){
            return res.status(400).json({error : err.message}); 
        }
        console.error("Internal server error", err); 
        res.status(500).send("Internal server error"); 
    }
}

