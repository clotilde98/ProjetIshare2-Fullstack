import {getUserByEmail, createUser} from '../model/client.js';
import { pool } from "../database/database.js";
import argon2 from "argon2";
import 'dotenv/config';
import jwt from "jsonwebtoken";
import { validateGoogleToken } from '../middleware/identification/validateUserGoogleToken.js';

/**
 * @swagger
 * components: 
 *   responses: 
 *      InvalidInput:
 *        description: User/password incorrect
 *        content:
 *          text/plain:
 *             schema: 
 *                type: string
 */

export const login = async (req, res) => {
    try {
        
        const { email, password } = req.body;
        const user = await getUserByEmail(pool, email)
        if (!user){
            return res.status(401).send("User/Password incorrect");
        }

        const validPassword = await argon2.verify(user.password, password + process.env.PEPPER);
        if (!validPassword) {
            return res.status(401).send("User/Password incorrect");
        }

    
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                isAdmin: user.isadmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        res.send({ token });
    } catch (err){
        res.status(500).send(err.message);
    }
}




export const loginWithGoogle = async (req, res) => {
    try {
        const { email, idToken, username, streetNumber, street, addressID} = req.body;
        const userInfo = await validateGoogleToken(idToken);

  
        //const photo = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  : null;   
        let user = await userModel.getUserByEmail(pool, email)


        if (!user){
            user = await createUser(pool, {googleId: userInfo.id, username, email: userInfo.email, streetNumber, street, imageName:null, addressID})
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                isAdmin: user.isadmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        res.send({ token });
    } catch (err){
        res.status(500).send(err.message);
    }
}


