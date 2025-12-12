import { Router } from 'express';
import {getMyReservations, getReservation,createReservation, getReservationsByClientID, getReservationsByPostID, updateReservation, deleteReservation,getReservations} from '../controller/reservationController.js'
import {reservationValidatorMiddleware} from '../middleware/validation.js';
import {checkJWT} from '../middleware/identification/jwt.js'
import { mustBeAdmin } from '../middleware/identification/mustBeAdmin.js';



const router = Router();

router.post("/", checkJWT, reservationValidatorMiddleware.createReservationValidator, createReservation);   
router.get("/", checkJWT, mustBeAdmin, getReservations);
router.get("/me", checkJWT, getMyReservations);
router.get("/client/:id", checkJWT, mustBeAdmin, getReservationsByClientID);
router.get("/post/:id", checkJWT, getReservationsByPostID);

router.get("/:id", checkJWT, mustBeAdmin, getReservation);
router.patch("/:id", checkJWT, reservationValidatorMiddleware.updateReservationValidator, updateReservation);
router.delete("/:id", checkJWT, deleteReservation);

export default router;

