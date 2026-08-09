import {getUserByEmail, createUser} from '../../model/v1/client.js';
import { pool } from "../../database/database.js";
import argon2 from "argon2";
import 'dotenv/config';
import jwt from "jsonwebtoken";
import { validateGoogleToken } from '../../middleware/identification/validateUserGoogleToken.js';

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

        const validPassword = await argon2.verify(user.password, password, {secret: Buffer.from(process.env.PEPPER)});
        if (!validPassword) {
            return res.status(401).send("User/Password incorrect");
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                isAdmin: user.isadmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        res.status(200).send({ token });
    } catch (err){
        console.error("Internal server error", err);  
        return res.status(500).send("Internal server error");
    }
}


export const loginWithGoogle = async (req, res) => {
    try {
        const {idToken}= req.body;
        const userInfo = await validateGoogleToken(idToken);

        let user = await getUserByEmail(pool, userInfo.email)


        if (!user){
            user = await createUser(pool, {googleId: userInfo.id, username : userInfo.name, email: userInfo.email, password: null, streetNumber: null, street: null, photo: userInfo.photo, isAdmin: false, addressID: null})
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                isAdmin: user.isadmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        res.status(200).send({ token });
    } catch (err){
        console.error("Internal server error", err); 
        return res.status(500).send("Internal server error");
    }
}