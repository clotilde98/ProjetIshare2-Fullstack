import axios from 'axios';

const BASE_URL = 'https://www.odwb.be/api/explore/v2.1/catalog/datasets/code-postaux-belge/records';
const LIMIT_PER_PAGE = 100;

export const importPostalData = async (client) => {
  let totalCount = 0;
  let offset = 0;

  const initialResponse = await axios.get(`${BASE_URL}?limit=1`);
  const total = initialResponse.data.total_count;

  while (offset < total) {
    const response = await axios.get(`${BASE_URL}?limit=${LIMIT_PER_PAGE}&offset=${offset}`);
    const records = response.data.results;

    for (const record of records) {
      const postalCode = record.column_1;
      const city = record.column_2;

      if (!postalCode || !city) continue;

      await client.query(
        `INSERT INTO Address (city, postal_code)
         VALUES ($1, $2)
         ON CONFLICT (city, postal_code) DO NOTHING`,
        [city.trim(), postalCode.trim()]
      );

      totalCount++;
    }

    offset += LIMIT_PER_PAGE;
  }

  return totalCount;
};

export const getAllCities = async (SQLClient) => {
    const { rows } = await SQLClient.query(
  `SELECT id, city, postal_code FROM Address ORDER BY postal_code ASC`  );
    return rows;
};


export const getAddressByID = async (SQLClient, {id}) => {
    const { rows } = await SQLClient.query(
  `SELECT * FROM Address WHERE id = $1`, [id]  );
    return rows[0];
};

