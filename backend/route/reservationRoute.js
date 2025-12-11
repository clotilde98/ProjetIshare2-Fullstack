import { Router } from 'express';
import {getMyReservations, getReservation,createReservation, getReservationsByClientID, getReservationsByPostID, updateReservation, deleteReservation,getReservations} from '../controller/reservationController.js'
import {reservationValidatorMiddleware} from '../middleware/validation.js';
import {isReservationOwner} from '../middleware/identification/isReservationOwner.js';
import {checkJWT} from '../middleware/identification/jwt.js'
import { mustBeAdmin } from '../middleware/identification/mustBeAdmin.js';
import {postOwner} from '../middleware/identification/postOwner.js';
import { orMiddleware } from '../middleware/utils/orMiddleware.js';


const router = Router();

router.post("/", checkJWT, reservationValidatorMiddleware.createReservationValidator, createReservation);   
router.get("/", checkJWT,orMiddleware(mustBeAdmin), getReservations);
router.get("/me", checkJWT, getMyReservations);
router.get("/client/:id", checkJWT, orMiddleware(mustBeAdmin), getReservationsByClientID);
router.get("/post/:id", checkJWT, orMiddleware(postOwner, mustBeAdmin), getReservationsByPostID);
router.get("/:id", checkJWT, orMiddleware(isReservationOwner, mustBeAdmin), getReservation);

router.patch("/", checkJWT, orMiddleware(isReservationOwner, mustBeAdmin), reservationValidatorMiddleware.updateReservationValidator, updateReservation);
router.delete("/:id", checkJWT, orMiddleware(isReservationOwner, mustBeAdmin), deleteReservation);

export default router;

