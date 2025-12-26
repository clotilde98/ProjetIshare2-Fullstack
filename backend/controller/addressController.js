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



export const getAddressByID = async (req, res) => {
  try {
    const id = req.params.id;
    const address = await addressModel.getAddressByID(pool, {id})
    return res.status(200).send({address});
  } catch (err) {
      res.status(500).send("Internal server error " + err.message); 
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
    res.status(500).send(err.message);
  }
};