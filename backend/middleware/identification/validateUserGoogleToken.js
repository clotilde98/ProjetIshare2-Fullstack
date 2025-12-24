import { OAuth2Client } from 'google-auth-library';
import dotenv from "dotenv";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const validateGoogleToken = async (idToken) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        
        return {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            photo: payload.picture
        };
    } catch (err) {
        throw new Error("Invalid Google token");
    }
};
