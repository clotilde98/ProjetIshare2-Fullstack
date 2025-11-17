import {getUserById } from "../../model/client.js"; 
import { pool } from "../../database/database.js";


/**
 * @swagger
 * components:
 *   responses:
 *     AccessDeniedError:
 *       description: Not the same user or not an admin
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *             example: Access denied
 */



export const isSameUser = async(req, res, next) => {
    try{
        const reqUserID = req.user.id;
        const targetUserID = parseInt(req.params.id) || req.body.id;
        const user = getUserById(pool, targetUserID); 
        const userIsAdmin = user.is_admin;
        console.log(targetUserID); 
        console.log(reqUserID);
        if((targetUserID === reqUserID) || userIsAdmin){
            next();
        }else{
            return res.status(403).send("Unauthorized access");
        }

    }catch(err) {
        res.status(500).send(err.message);
    }
}