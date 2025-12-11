import dotenv from "dotenv";
import { pool } from "../database/database.js";
import {getUserByEmail} from '../model/client.js';

dotenv.config();



export const sendResetEmailLink = async (email) => {
   try{
    const [rows]= await getUserByEmail(pool, email);
    if (rows.length === 0){
        return {success:false,message:'User not found'};
    }
    const user = rows[0];
    const resetToken = jwt.sign(
               { id: user.id, email: user.email },
               process.env.JWT_SECRET,
               { expiresIn: "1h" } );

    const resetLink = `http://localhost:3002/reset-password?token=${resetToken}`;
    console.log(resetLink);
        return {success:true,message:'Reset password email sent successfully',resetLink};
 
   }catch (err) {
        throw new Error("login error");
    }
   
    
};
