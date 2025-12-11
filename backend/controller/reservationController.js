import { pool } from "../database/database.js";

import {readPost} from '../model/postDB.js'

import {getUserById} from '../model/client.js'

import * as reservationModel from '../model/reservationDB.js';



const VALID_STATUSES = ['confirmed', 'cancelled', 'withdrawal']; 

export const getReservations = async (req, res) => { 
    try {
        const { username, status, page, limit } = req.query;

        if (status && !VALID_STATUSES.includes(status)) {
            return res.status(400).json({ 
                message: `Le statut de réservation doit être l'un des suivants : "${VALID_STATUSES.join('", "')}".` 
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
        console.error('Erreur récupération réservations :', err.message);
        
    }
};


export const getReservation = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id || isNaN(parseInt(id))){
            return res.status(400).send("Reservation ID is invalid")
        }
        const reservation = await reservationModel.readReservation(pool, {id});
        if (reservation){
            res.send(reservation);
        } else {
            res.status(404).send("Reservation not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}



export const getMyReservations = async (req, res) => {
    try {
        const id = req.user.id;
        const reservations = await reservationModel.readReservationsByClientID(pool, {id});
        if (reservations.length > 0){
            res.send(reservations);
        } else {
            res.status(404).send("Client reservation not found");
        }

    } catch (err){
        res.status(500).send(err.message);
    }
}

export const getReservationsByClientID = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id || isNaN(parseInt(id))){
            return res.status(400).send("Client reservation ID is invalid")
        }
        
        const reservations = await reservationModel.readReservationsByClientID(pool, {id});
        console.log(reservations);
        if (reservations.length > 0){
            res.send(reservations);
        } else {
            res.status(404).send("Client reservation not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const getReservationsByPostID = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id || isNaN(parseInt(id))){
            return res.status(400).send("Post reservations ID is invalid")
        }
        const reservation = await reservationModel.readReservationsByPostID(pool, {id});
        if (reservation){
            res.send(reservation);
        } else {
            res.status(404).send("Post reservations not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}


export const createReservation = async (req, res) => {
    try {
        const currentUserID =  req.user.id ; 
        const providedClientID = req.body.clientID;
        const isAdmin = req.user.isAdmin ; 

        let reservationClientID;
        
        if (req.user && isAdmin && providedClientID) {
            reservationClientID = providedClientID;
        } else if (req.user) {
            reservationClientID = currentUserID;
        } else {
            return res.status(401).send("Authentication required to create a reservation.");
        }

        const clientID = reservationClientID;         
        const { postID } = req.body;
        
        const post = await readPost(pool, {id : postID});
        
        if (!post){
            return res.status(404).send("Post doesn't exist");
        } else {
            if (post.post_status === 'unavailable'){
                return res.status(404).send("Post is unavailable");
            }
            const countCurrentReservationsForPost = await reservationModel.readReservationsByPostID(pool, {id:postID});
            if (post.number_of_places > countCurrentReservationsForPost.length){
                const client = await getUserById(pool, clientID); 
                if (!client){
                    return res.status(404).send("User not found");
                } else {
                    const userReservation = await reservationModel.readReservationByClientIDAndByPostID(pool, {clientID:client.id, postID})
                    if (userReservation){
                        return res.status(401).send("Reservation already exists");
                    }

                    if (post.client_id == clientID){
                        return res.status(403).send("You can't make a reservation for a post that you posted");
                    }

                    const newReservation = await reservationModel.createReservation(pool, clientID, req.body); // Utilise l'ID résolu
                    res.status(201).send(newReservation.id);
                }
            } else {
                res.status(409).send("Number of place for the post had already reached the max capacity");
            }
            
        }
    } catch (err){
        res.status(500).send(err.message);
    }
}

export const updateReservation = async (req, res) => {
    try {
        const {reservationDate, reservationStatus} = req.body
        if (reservationDate){
            const reservationTimestamp = new Date(reservationDate).getTime();

            if (reservationTimestamp < Date.now()) {
                return res.status(409).send("Reservation date cannot be in the past");
            }
        }

        if (reservationStatus){
            if (reservationStatus !== 'confirmed' && reservationStatus !== 'cancelled'){
                return res.status(409).send("Reservation status can only either be 'confirmed' or 'cancelled'");
            }
        }


        await reservationModel.updateReservation(pool, req.body);
        res.sendStatus(204)
        
    } catch (err){
        res.status(500).send(err.message);
    }
}

export const deleteReservation = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || isNaN(parseInt(id))){
            return res.status(400).send("Reservation ID invalid")
        }
        const rowCount = await reservationModel.deleteReservation(pool, req.params); 
        if (!rowCount){
            return res.status(404).send(`Reservation with ID ${id} not found`);
        } else {
            res.status(200).send(`Reservation ${id} deleted successfully`);
        }
        
    } catch (err) {
        res.status(500).send(err.message);
    }
};