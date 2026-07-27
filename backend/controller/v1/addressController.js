import { pool } from '../../database/database.js';
import * as addressModel from '../../model/v1/addressDB.js';


export const importPostalData = async (req, res) => {
  let client;

  try {
    client = await pool.connect();
    await client.query('BEGIN');

    const totalCount = await addressModel.importPostalData(client);
    await client.query('COMMIT');

    const message = `Importation réussie de ${totalCount} villes et codes postaux.`;
    res.status(200).send(message);
  } catch (err) {
    if (client) await client.query('ROLLBACK');
      console.error("Internal server error", err); 
      res.status(500).send("Internal server error"); 
  } finally {
    if (client) address.release();
  }
};



export const getAddressByID = async (req, res) => {
  try {
    const id = req.params.id;
    const address = await addressModel.getAddressByID(pool, {id})
    return res.status(200).send({address});
  } catch (err) {
      console.error("Internal server error", err); 
      res.status(500).send("Internal server error");   
  }};

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
 *         postalCode:
 *           type: string
 *   responses: 
 *     ReadAllCities:
 *       description: All cities read from the external API
 *       content: 
 *         application/json:
 *           schema:   
 *             type: array
 *             items: 
 *               $ref: '#/components/schemas/Address'
 */

export const getAllCities = async (req, res) => {
  try {
    const cities = await addressModel.getAllCities(pool);
    res.status(200).send(cities);
  } catch (err) {
    console.error("Internal server error", err); 
    res.status(500).send("Internal server error"); 
  }
};