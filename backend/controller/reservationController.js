
import { pool } from "../database/database.js";

import {readPost} from '../model/postDB.js'

import * as reservationModel from '../model/reservationDB.js';

import {sendNotification} from '../../backend/websocket.js'; 



const VALID_STATUS = ['confirmed', 'cancelled', 'withdrawal']; 

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
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
 *         title: 
 *           type: string
 *         username: 
 *           type: string
 *
 *   responses:
 *     ReservationsList:
 *       description: List of reservations depending on the function used
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Reservation'
 */


export const getReservations = async (req, res) => { 
    try {
        const { username, status, page, limit } = req.query;

        if (status && !VALID_STATUS.includes(status)) {
            return res.status(400).json({ 
                message: `Reservation status can only be : "${VALID_STATUS.join('", "')}".` 
            });
        }

        const args = {
            username: username,
            reservationStatus: status, 
             page: parseInt(page) || 1, 
            limit: parseInt(limit) || 10   
        };

       
        const result = await reservationModel.getReservations(pool, args);

        res.status(200).json(result); 
        
    } catch (err) {
        res.status(500).send('Internal server error :', err.message);
        
    }
};


export const getReservation = async (req, res) => {
    try {
        const reservationID = parseInt(req.params.id);
        if (Number.isNaN(reservationID)) {
            return res.status(400).send("Invalid reservation ID");
        }

        const reservation = await reservationModel.readReservation(pool, { id: reservationID });

        if (!reservation) {
            return res.status(404).send("Reservation not found");
        }

        res.status(200).json({ reservation });

    } catch (err) {
        res.status(500).send(`Internal server error: ${err.message}`);
    }
};

export const getMyReservations = async (req, res) => {
    try {
        const userID = req.user.id;
        const rows = await reservationModel.readMyReservations(pool, { clientID: userID });

        const reservations = rows.map(row => ({
            id: row.reservation_id,
            title: row.title,
            address: `${row.street_number} ${row.street}`,
            location: `${row.postal_code} ${row.city}`,
            image: row.photo ? `${req.protocol}://${req.get('host')}/images/${row.photo}.jpeg` : null,
            ownerName: row.owner_name,
            ownerPhoto: row.owner_photo ? `${req.protocol}://${req.get('host')}/images/${row.owner_photo}.jpeg` : null
        }));

        res.status(200).json(reservations);
    } catch (err) {
        res.status(500).send("Erreur : " + err.message);
    }
};



export const getReservationsByClientID = async (req, res) => {
    try {
        const clientID = parseInt(req.params.id);
        if (Number.isNaN(clientID)) return res.status(400).send("Invalid client ID");

        
        const reservations = await reservationModel.readReservationsByClientID(pool, {id:clientID});
        if (reservations.length > 0){
            res.status(200).send({reservations});
        } else {
            res.status(404).send("Client reservation not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const getReservationsByPostID = async (req, res) => {
    try {
        const postID = parseInt(req.params.id);
        if (Number.isNaN(postID)) return res.status(400).send("Invalid post ID");

        const post = await readPost(pool, {id:postID});
        if (!post) return res.status(404).send("Post doesn't exist");

        if (post.client_id !== req.user.id && !req.user.isAdmin) return res.status(403).send("Admin privilege required");


        const reservations = await reservationModel.readReservationsByPostID(pool, {id:postID});
        
        res.status(200).send({reservations});
        
    } catch (err) {
        res.status(500).send("Internal server error : " + err.message);
    }
}


/**
 * @swagger
 * components:
 *   responses:
 *       ReservationResponse: 
 *            description:  The reservation object is returned   
 *            content: 
 *              application/json: 
 *                     schema: 
 *                       $ref: '#/components/schemas/Reservation'  
 */



export const createReservation = async (req, res) => {
    try {
        let userID = req.user.id; 
        const { postID } = req.body;

        if (req.body.providedClientID) {
            if (req.user.isAdmin) {
                userID = req.body.providedClientID;
            } else {
                return res.status(403).send("Admin privilege required");
            }
        }

        const post = await readPost(pool, { id: postID });
        if (!post) return res.status(404).send("Post doesn't exist");


        if (post.client_id === userID) {
            return res.status(403).send("You can't make a reservation for a post that you posted");
        }

        if (post.post_status === 'unavailable') {
            return res.status(409).send("Post is unavailable");
        }

        const currentReservations = await reservationModel.readReservationsByPostID(pool, { id: postID });
        if (currentReservations.length >= post.number_of_places) {
            return res.status(409).send("Number of places for the post has already reached the max capacity");
        }

        const userReservation = await reservationModel.readReservationByClientIDAndByPostID(pool, { clientID: userID, postID });
        if (userReservation) {
            return res.status(409).send("Reservation already exists");
        }

        const newReservation = await reservationModel.createReservation(pool, userID, req.body); 


        const informationPostReservation = await reservationModel.getReservationWithPostTitle(pool, {clientID: userID , postID}); 
        console.log(informationPostReservation.username); 
        const notification = {
            type: 'reservation', 
            message:  `${informationPostReservation.username} a réservé ton post "${post.title}"`,
            postId: postID, 
            reserverId: userID

        }; 

        console.log(informationPostReservation.client_id);
        sendNotification(informationPostReservation.owner_id, notification);

        res.status(201).json({ reservation: newReservation });

    } catch (err) {
        res.status(500).send(err.message);
    }
}






export const updateReservation = async (req, res) => {
    try {
        const reservationID = Number(req.params.id);

        const { reservationStatus, postID, providedClientID} = req.body

        let userID = req.user.id; 

        if (providedClientID) {
            if (req.user.isAdmin) {
                userID = providedClientID;
            } else {
                return res.status(403).send("Admin privilege required");
            }
        }

        if (Number.isNaN(reservationID)) return res.status(400).send("Invalid reservation ID");


        const reservation = await reservationModel.readReservation(pool, {id:reservationID});
        if (!reservation) return res.status(404).send("Reservation not found");


        if (reservation.client_id !== req.user.id && !req.user.isAdmin) {
            return res.status(403).send("Admin privilege required.");
        }

        const post = await readPost(pool, {id:reservation.post_id});

        if (post.client_id === userID) {
            return res.status(403).send("Impossible to create a reservation. User is the owner of the post.");
        }
        

        if (reservationStatus){
            if (!VALID_STATUS.includes(reservationStatus)){
                return res.status(400).json({ 
                    message: `Reservation status can only be : "${VALID_STATUS.join('", "')}".` 
                });
            }
        }

        const updatedReservation = await reservationModel.updateReservation(pool, { id: reservationID, clientID:providedClientID, postID, reservationStatus })

       return res.status(200).json(updatedReservation);
        
    } catch (err){
        res.status(500).send(err.message);
    }
}

export const deleteReservation = async (req, res) => {
    try {
        const reservationID = Number(req.params.id);

        if (Number.isNaN(reservationID)) return res.status(400).send("Invalid reservation ID");

        const reservation = await reservationModel.readReservation(pool, {id:reservationID});
        if (!reservation) return res.status(404).send("Reservation not found");


        if (reservation.client_id !== req.user.id && !req.user.isAdmin) {
            return res.status(403).send("Admin privilege required.");
        }


        await reservationModel.deleteReservation(pool, {id:reservationID}); 
        
        res.status(200).send(`Reservation ${reservationID} deleted successfully`);
        
        
    } catch (err) {
        res.status(500).send("Internal server error : " + err.message);
    }
};

