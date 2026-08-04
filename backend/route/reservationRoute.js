import { Router } from 'express';
import {reservationValidatorMiddleware} from '../middleware/validation.js';
import {checkJWT} from '../middleware/identification/jwt.js'
import { mustBeAdmin } from '../middleware/identification/mustBeAdmin.js';


export const reservationRouter = (controller) => {
const router = Router();

router.post("/", checkJWT, reservationValidatorMiddleware.createReservationValidator, controller.createReservation);   

router.get("/", checkJWT, mustBeAdmin, controller.getReservations);

router.get("/me", checkJWT, controller.getMyReservations);

router.get("/client/:id", checkJWT, mustBeAdmin, controller.getReservationsByClientID);

router.get("/post/:id", checkJWT, controller.getReservationsByPostID);

router.get("/:id", checkJWT, mustBeAdmin, controller.getReservation);

router.patch("/:id", checkJWT, reservationValidatorMiddleware.updateReservationValidator, controller.updateReservation);

router.delete("/:id", checkJWT, controller.deleteReservation);

return router; 

}