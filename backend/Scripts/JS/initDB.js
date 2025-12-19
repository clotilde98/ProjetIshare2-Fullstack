import 'dotenv/config';
import {readFileSync} from "node:fs";
import {pool} from "../../database/database.js";
import {importPostalData} from "../../model/addressDB.js"
import argon2 from "argon2";


const requests = readFileSync(
    './Scripts/SQL/initDB.sql',
    {encoding: "utf-8"}
);



/**
 *@swagger
 *post: 
 *  tags:
 *    - Postal Data 
 *  responses:
 *  200:
 *    description: Import successful
 *      content: 
 *        text/plain:
 *        schema: 
 *            type: string
 *  503:
 *    description: External API error 
 *    content: 
 *      text/plain: 
 *          schema: 
 *              type: string  
 *  500:
 *     description:Error servor
 *       
 */

try {




    async function waitForDB() {
        let connected = false;
        while (!connected) {
            try {
            await pool.query("SELECT 1");
            connected = true;
            } catch (e) {
            await new Promise(res => setTimeout(res, 1000));
            }
        }
    }

    await waitForDB();



    await pool.query(requests, []);
    await importPostalData(pool);
    let password = "test";
    const pepper = process.env.PEPPER;
    const passwordWithPepper = password + pepper;
    const hash = await argon2.hash(passwordWithPepper);
    password = hash


    for (let i = 0; i < 10; i++) {
        const username = i === 0 ? 'test' : `test${i}`;
        const email = i === 0 ? 'test@example.com' : `test${i}@example.com`;

        await pool.query(
            `
            INSERT INTO Client 
            (googleId, username, email, password, street_number, street, photo, is_admin, address_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `,
            [
            null,
            username,
            email,
            password,
            i + 1,
            "rue de l'europe",
            null,
            i % 2 == 0,
            1
            ]
        );
    }

    console.log("done");



} catch (e) {
    console.error(e);
}