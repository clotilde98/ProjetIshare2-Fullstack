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
 *     ConnectionSuccess: 
 *         description: the token is returned
 *         content:
 *          application/json: 
 *              schema: 
 *                  type: object
 *                  properties: 
 *                    token: 
 *                      type: string
 *     InvalidInput:
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
        res.status(200).send({ user, token });
    } catch (err){
        res.status(500).send(err.message);
    }
}


export const loginWithGoogle = async (req, res) => {
    try {
        console.log('---------'); 
        const { idToken} = req.body;
        if (!idToken) {
            return res.status(400).json({ message: "idToken missing" });
        }

        const googleUser = await validateGoogleToken(idToken);

        const { id: googleId, email, name, photo } = googleUser;
        let user = await getUserByEmail(pool, email);

        
        if (!user){
            user = await createUser(pool, {googleId, username:name, email, password:null, streetNumber:null, street:null, photo, isAdmin:false, addressID:null})
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
        res.status(200).send({ user, token });
    } catch (err){
        res.status(500).send(err.message);
    }
}


