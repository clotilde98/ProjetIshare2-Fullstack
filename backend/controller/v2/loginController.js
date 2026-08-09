import {getUserByEmail, getUserById, createUser} from '../../model/v1/client.js';
import { pool } from "../../database/database.js";
import argon2 from "argon2";
import 'dotenv/config';
import jwt from "jsonwebtoken";
import { validateGoogleToken } from '../../middleware/identification/validateUserGoogleToken.js';

const createTokenPayload = (user) => ({
    id: user.id,
    isAdmin: user.isadmin,
});

const buildAuthResponse = (user) => {
    const payload = createTokenPayload(user);
    const accessToken = jwt.sign(
        { ...payload, tokenType: 'access' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    const refreshToken = jwt.sign(
        { ...payload, tokenType: 'refresh' },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    return {
        token: accessToken,
        refreshToken,
    };
};

/**
 * @swagger
 * components:  
 *   responses: 
 *     ConnectionSuccessV2: 
 *         description: tokens is returned
 *         content:
 *          application/json: 
 *              schema: 
 *                  type: object
 *                  properties: 
 *                    token: 
 *                      type: string
 *                    refreshToken: 
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
        res.status(200).send(buildAuthResponse(user));

    } catch (err){
        console.error("Internal server error", err);  
        return res.status(500).send("Internal server error");
    }
}


export const loginWithGoogle = async (req, res) => {
    try {
        const {idToken} = req.body;
        if (!idToken) {
            return res.status(400).json({ message: "idToken missing" });
        }

        const googleUser = await validateGoogleToken(idToken);

        const { id: googleId, email, name, photo } = googleUser;
        let user = await getUserByEmail(pool, email);

        
        if (!user){
            user = await createUser(pool, {googleId, username:name, email, password:null, streetNumber:null, street:null, photo, isAdmin:false, addressID:null})
        }

        res.status(200).send(buildAuthResponse(user));
    } catch (err){
        console.error("Internal server error", err);
        res.status(500).send(err.message);
    }
}



export const refreshToken = async (req, res) => {
    try {
        const { refreshToken: incomingRefreshToken } = req.body;

        if (!incomingRefreshToken) {
            return res.status(400).json({ message: "Refresh token missing" });
        }

        const decoded = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET 
        );

        if (decoded.tokenType !== 'refresh') {
            return res.status(401).json({ message: "Refresh token invalid" });
        }

        const user = await getUserById(pool, decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        res.status(200).send(buildAuthResponse(user));
    } catch (err) {
        console.error("Internal server error", err);
        return res.status(403).json({ message: "Refresh token invalid" });
    }
};