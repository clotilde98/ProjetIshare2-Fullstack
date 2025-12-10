import {pool} from "../database/database.js";
import * as dashboardModel from "../model/dashboardModel.js";
 

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardStats:
 *       type: object
 *       properties:
 *         totalAnnonces:
 *           type: integer
 *           description: Total number of posts
 *         totalReservation:
 *           type: integer
 *           description: Total number of reservations
 *         totalRetraits:
 *           type: integer
 *           description: Total number of withdrawals
 *         utilisateursActifs:
 *           type: integer
 *           description: Total number of active users
 *
 *   responses:
 *     AllStatReaded:
 *       description: All stats are obtained
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/DashboardStats"
 */

export const getAllStats = async (req, res) => {
    try {
        const [
            totalAnnonces, 
            totalReservations, 
            totalRetraits, 
            utilisateursActifs 
        ] = await Promise.all([
            dashboardModel.getTotalPosts(pool),
            dashboardModel.getTotalReservations(pool),
            dashboardModel.getTotalConfirmedReservations(pool),
            dashboardModel.getTotalUsers(pool),
        ]);

        res.status(200).json({
            totalAnnonces: totalAnnonces,
            totalReservations: totalReservations,
            totalRetraits: totalRetraits, 
            utilisateursActifs: utilisateursActifs,
        });

    } catch (err) {
        res.status(500).json({ message: "Erreur serveur lors de l'agrégation des statistiques." });
    }
};