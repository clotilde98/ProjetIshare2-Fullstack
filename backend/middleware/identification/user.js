import {getUserById } from "../../model/client.js"; 
import { pool } from "../../database/database.js";

export const isSameUser = async(req, res, next) => {
    try{
        
        const reqUserID = req.user.id;
        const targetUserID = parseInt(req.params.id) || req.body.id;
        const user = getUserById(pool, targetUserID); 

        const userIsAdmin = user.is_admin;
        
        if((targetUserID === reqUserID) || userIsAdmin){
            next();
        }else{
            return res.status(403).send("Unauthorized access");
        }

    }catch(err) {
        res.status(500).send(err.message);
    }
}