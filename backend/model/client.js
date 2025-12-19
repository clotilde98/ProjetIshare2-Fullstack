import 'dotenv/config';
import argon2 from "argon2";


export const createUser = async (SQLClient, { googleId = null, username, email, password, streetNumber, street, photo = null, isAdmin = false, addressID }) => {

  if (password){
    const pepper = process.env.PEPPER;
    const passwordWithPepper = password + pepper;
    const hash = await argon2.hash(passwordWithPepper);
    password = hash
  }
  
  
  const { rows } = await SQLClient.query(
    `INSERT INTO Client (googleId, username, email, password, street_number, street, photo, is_admin, address_id) VALUES ($1, $2, $3, $4, $5, $6, $7 ,$8, $9) RETURNING *`,
    [googleId, username, email, password, streetNumber, street, photo, isAdmin, addressID]);

    const user = rows[0];
    delete user.password;
    return user;
};



export const getUserById = async (SQLClient, id) => {
  const { rows } = await SQLClient.query(
    `SELECT googleId, id, username, email, street, street_number, registration_date, photo, is_admin AS isAdmin, address_id
     FROM Client
     WHERE id = $1`,
    [id]
  );
  return rows[0] ;
};

export const getUserByEmail = async (SQLClient, email) => {
  const { rows } = await SQLClient.query(
    `SELECT googleId, password, id, username, email, street, street_number, registration_date, photo, is_admin AS isAdmin, address_id
     FROM Client
     WHERE email = $1`,
    [email]
  );
  return rows[0] ;
};

export const getUserByUsernameOrEmail = async (SQLClient, username, email) => {
    const { rows } = await SQLClient.query(
        `SELECT googleId, id, username, email, street, street_number, registration_date, photo, is_admin AS isAdmin, address_id
         FROM Client
         WHERE username = $1 OR email = $2`,
        [username, email] 
    );
    
    return rows[0]; 
};

export const getProfileById = async (SQLClient, id) => {
    const { rows } = await SQLClient.query(
        `SELECT googleId, id, username, email, street, street_number, registration_date, photo, is_admin AS isAdmin, address_id
        FROM  Client
        WHERE id = $1`,
        [id]
    );
    return rows[0];
};
  
export const updateUser = async (SQLClient, id, { username, email, password, photo, isAdmin, street, streetNumber,addressID }) => {
    let query = "UPDATE Client SET ";
    const querySet = []; 
    const queryValues = []; 

    if (username) {
        queryValues.push(username);
        querySet.push(`username = $${queryValues.length}`);
    }
    
    if (email) {
        queryValues.push(email);
        querySet.push(`email = $${queryValues.length}`);
    }
    
    if (password) {
        queryValues.push(password);
        querySet.push(`password = $${queryValues.length}`);
    }
    
    if (photo) {
        queryValues.push(photo);
        querySet.push(`photo = $${queryValues.length}`);
    }
    
    if (isAdmin !== undefined) { 
        queryValues.push(isAdmin);
        querySet.push(`is_admin = $${queryValues.length}`);
    }

    if (street) { 
        queryValues.push(street);
        querySet.push(`street = $${queryValues.length}`);
    }

    if (streetNumber) { 
        queryValues.push(streetNumber);
        querySet.push(`street_number = $${queryValues.length}`);
    }
    if (addressID){
        queryValues.push(addressID);
        querySet.push(`address_id = $${queryValues.length}`);
    }

    if (queryValues.length > 0) {
        queryValues.push(id); 
        query += `${querySet.join(", ")} WHERE id = $${queryValues.length} RETURNING *`;
        const result = await SQLClient.query(query, queryValues);
        const user = result.rows[0];

        delete user.password;

        return user;

    } else {
        throw new Error("No field given (client name)");
    }
};




export const getUsers = async (SQLClient, { name, role, page = 1, limit = 10 }) => {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    const offset = (pageNum - 1) * limitNum;
    
    const conditions = [];
    const values = []; 

    if (name) {
        values.push(`%${name}%`);
        conditions.push(`LOWER(c.username) LIKE LOWER($${values.length})`);
    }

    if (role === 'admin') {
        conditions.push(`c.is_admin = true`);
    } else if (role === 'user') {
        conditions.push(`c.is_admin = false`);
    }

    const whereClause = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(c.id) AS total
    FROM Client c
    JOIN Address a ON c.address_id = a.id${whereClause}`;

    try {
        
        const countResult = await SQLClient.query(countQuery, values); 
        const total = parseInt(countResult.rows[0].total, 10);
        
        const limitIndex = values.length + 1; 
        const offsetIndex = values.length + 2; 

        const dataQuery = `SELECT c.id, c.username, c.email, c.registration_date, c.address_id,
                c.is_admin, a.city, a.postal_code, c.street, c.street_number
        FROM Client c
        JOIN Address a ON c.address_id = a.id
        ${whereClause}
        ORDER BY c.registration_date DESC
        LIMIT $${limitIndex} OFFSET $${offsetIndex}`; 

        
        values.push(limitNum);
        values.push(offset);
        
        const dataResult = await SQLClient.query(dataQuery, values);
        const rows = dataResult.rows;

        return { rows, total }; 

    } catch (err) {
        throw new Error(`Erreur SQL dans getUsers : ${err.message}`); 
    }
};

export const deleteUser = async (SQLClient, id) => {
  const { rowCount } = await SQLClient.query(
    'DELETE FROM Client WHERE id = $1',
    [id]
  );
  return rowCount > 0;
};