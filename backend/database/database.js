// database/database.js
import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

const connectionConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.HOSTDB,
      user: process.env.USERDB,
      password: process.env.PASSWORDDB,
      database: process.env.DBNAME,
      port: process.env.PORTDB ? Number(process.env.PORTDB) : 5432
    };

const pgPool = new Pool(connectionConfig);

export const pool = {
  connect: async () => {
    const client = await pgPool.connect();
    return {
      query: async (queryText, params) => client.query(queryText, params),
      release: () => client.release()
    };
  },
  query: async (queryText, params) => pgPool.query(queryText, params),
  end: () => pgPool.end()
};

process.on('exit', () => {
pgPool.end().then(() => console.log('pool closed'));
});
