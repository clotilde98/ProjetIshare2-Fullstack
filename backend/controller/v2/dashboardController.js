import {pool} from "../../database/database.js";
import * as dashboardModel from "../../model/v1/dashboardModel.js";
 
/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardStatsV2:
 *       type: object
 *       properties:
 *         totalPosts:
 *           type: integer
 *           description: Total number of posts
 *         totalReservations:
 *           type: integer
 *           description: Total number of reservations
 *         totalWithdrawals:
 *           type: integer
 *           description: Total number of withdrawals
 *         activeUsers:
 *           type: integer
 *           description: Total number of active users
 *
 *   responses:
 *     AllStatReadedV2:
 *       description: All stats are obtained
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/DashboardStatsV2"
 */

export const getAllStats = async (req, res) => {
    try {
        const [
            totalPosts, 
            totalReservations, 
            totalWithdrawals, 
            activeUsers 
        ] = await Promise.all([
            dashboardModel.getTotalPosts(pool),
            dashboardModel.getTotalReservations(pool),
            dashboardModel.getTotalConfirmedReservations(pool),
            dashboardModel.getTotalUsers(pool),
        ]);

        res.status(200).json({
            totalPosts: totalPosts,
            totalReservations: totalReservations,
            totalWithdrawals: totalWithdrawals, 
            activeUsers: activeUsers,
        });

    } catch (err) {
        console.error("Internal server error", err); 
        res.status(500).json({ message: "Server error during statistics aggregation." });
    }
};