import { readPost } from "../../model/postDB.js";
import { getUserById } from "../../model/client.js";
import { pool } from "../../database/database.js";



export const postOwner = async (req, res, next) => {
    try {
        const postClientID = await readPost(pool, {id:(parseInt(req.params.id) || req.body.id)});
        if (postClientID && req.user.id === postClientID.client_id ){
            next();
        } else {
            next(new Error("Unauthorized"));
        }
    } catch (err){
        res.status(500).send(err.message);
    }
}


