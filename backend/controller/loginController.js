import {getUserByEmail} from '../model/client.js';
import { pool } from "../database/database.js";
import argon2 from "argon2";
import 'dotenv/config';
import jwt from "jsonwebtoken";

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