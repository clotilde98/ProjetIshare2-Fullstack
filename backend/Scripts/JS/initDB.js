import {readFileSync} from "node:fs";
import {pool} from "../../database/database.js";
import {importPostalData} from "../../model/addressDB.js"



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
 *  '200':
 *    description: Import successful
 *      content: 
 *        text/plain:
 *        schema: 
 *            type: string
 *  '503':
 *    description: External API error 
 *    content: 
 *      text/plain: 
 *          schema: 
 *              type: string  
 *  '500':
 *     description:Error servor
 *     content: 
 *       text/plain: 
 *           schema: 
 *              type: string  
 *       
 */

try {
    await pool.query(requests, []);
    await importPostalData(pool);
    console.log("done");
} catch (e) {
    console.error(e);
}