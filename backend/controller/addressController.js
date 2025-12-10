import { pool } from '../database/database.js';
import * as addressModel from '../model/addressDB.js';


export const importPostalData = async (req, res) => {
  let address;
  let status = 500;
  let errorMessage = 'Échec de l\'importation des données.';

  try {
    address = await pool.connect();
    await address.query('BEGIN');

    const totalCount = await addressModel.importPostalData(client);
    await address.query('COMMIT');

    const message = `Importation réussie de ${totalCount} villes et codes postaux.`;
    res.status(200).send(message);
  } catch (err) {
    if (address) await client.query('ROLLBACK');

    if (err.message.includes('API externe')) {
      status = 503;
      errorMessage = err.message;
    }

    res.status(status).send(errorMessage);
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