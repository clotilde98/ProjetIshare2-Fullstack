import { pool } from '../database/database.js';
import * as addressModel from '../model/addressDB.js';


export const importPostalData = async (req, res) => {
  let address;

  try {
    address = await pool.connect();
    await address.query('BEGIN');

    const totalCount = await addressModel.importPostalData(client);
    await address.query('COMMIT');

    const message = `Importation réussie de ${totalCount} villes et codes postaux.`;
    res.status(200).send(message);
  } catch (err) {
    if (address) await client.query('ROLLBACK');

    res.status(500).send(err.message);
  } finally {
    if (address) address.release();
  }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         city:
 *           type: string
 *         postal_code:
 *           type: string
 */


/**
 * @swagger
 * components:
 *  responses: 
 *    ReadAllCities:
 *        description: all cities read from the extern API
 *        content: 
 *          application/json:
 *            schema:   
 *              $ref: '#/components/schemas/Address'
 *  
 */

export const getAllCities = async (req, res) => {
  try {
    const cities = await addressModel.getAllCities(pool);
    res.send(cities);
  } catch (err) {
    res.status(500).send(err.message);
  }
};