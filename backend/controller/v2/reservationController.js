import { pool } from "../../database/database.js";

import {readPost} from '../../model/v1/postDB.js'

import * as reservationModel from '../../model/v2/reservationDB.js';
import { PAGINATION } from '../../Config/pagination.js';
import {validatePagination} from '../../Utils/validationPagination.js'; 
import { PaginationValidationError } from "../../errors/PaginationValidationError.js"; 


export const getMyReservations = async (req, res) => {
    try {
        let userID = req.user.id;
        const {page, limit} = req.query; 
        const limitResult = validatePagination(undefined, PAGINATION.DEFAULT_LIMIT, PAGINATION.MIN_LIMIT, PAGINATION.MAX_LIMIT, 'limit');
        const pageResult  = validatePagination(undefined, PAGINATION.DEFAULT_PAGE, PAGINATION.MIN_LIMIT, PAGINATION.MAX_LIMIT, 'page');  

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


export const getReservationsByClientID = async (req, res) => {
    try {
        const clientID = parseInt(req.params.id);
        if (Number.isNaN(clientID)) return res.status(400).send("Invalid client ID");

        const {page, limit} = req.query; 
        const limitResult = validatePagination(undefined, PAGINATION.DEFAULT_LIMIT, PAGINATION.MIN_LIMIT, PAGINATION.MAX_LIMIT, 'limit');
        const pageResult  = validatePagination(undefined, PAGINATION.DEFAULT_PAGE, PAGINATION.MIN_LIMIT, PAGINATION.MAX_LIMIT, 'page');  

        const reservations = await reservationModel.readReservationsByClientID(pool, {id : clientID, page : pageResult, limit : limitResult});
        if (reservations.total > 0){
            res.status(200).send({reservations});
        } else {
            res.status(404).send("Client reservation not found");
        }
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
        const postID = parseInt(req.params.id);
        if (Number.isNaN(postID)) return res.status(400).send("Invalid post ID");

        const {page, limit} = req.query; 
        const limitResult = validatePagination(undefined, PAGINATION.DEFAULT_LIMIT, PAGINATION.MIN_LIMIT, PAGINATION.MAX_LIMIT, 'limit');
        const pageResult  = validatePagination(undefined, PAGINATION.DEFAULT_PAGE, PAGINATION.MIN_LIMIT, PAGINATION.MAX_LIMIT, 'page'); 

        const post = await readPost(pool, postID);
        if (!post) return res.status(404).send("Post doesn't exist");

        if (post.client_id !== req.user.id && !req.user.isAdmin) return res.status(403).send("Admin privilege required");


        const reservations = await reservationModel.readReservationsByPostID(pool, {postID, page, limit});

        if (reservations.total > 0){
            res.status(200).send({reservations});
        } else {
            res.status(404).send("Reservation for the post not found");
        }
        
    } catch (err) {
        if(err instanceof PaginationValidationError){
            return res.status(400).json({error : err.message}); 
        }
        console.error("Internal server error", err); 
        res.status(500).send("Internal server error"); 
    }
}

