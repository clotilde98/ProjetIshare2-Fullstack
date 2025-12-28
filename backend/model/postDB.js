import {createPostCategory} from './postCategory.js';

export const createPost = async (SQLClient, clientID, {description, title, numberOfPlaces, photo, street, streetNumber, addressID}) => {

    try {
        const {rows} = await SQLClient.query(
        `INSERT INTO Post (description, title, number_of_places, post_status, photo, street, street_number, address_id, client_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [description, title, numberOfPlaces, 'available', photo, street, streetNumber, addressID, clientID]
        );
        return rows[0];
    } catch (err) {
        throw err;
    }
};



export const updatePost = async(SQLClient, id, {description, title, numberOfPlaces, postStatus, photo,street,streetNumber, addressID}) => {
    let query = "UPDATE post SET ";
    const querySet = [];
    const queryValues = [];
    
    if(description){
        queryValues.push(description);
        querySet.push(`description = $${queryValues.length}`);
    }

    if (title){
        queryValues.push(title);
        querySet.push(`title = $${queryValues.length}`);
    }

    if (numberOfPlaces){
        queryValues.push(numberOfPlaces);
        querySet.push(`number_of_places = $${queryValues.length}`);
    }

    if (postStatus){
        queryValues.push(postStatus);
        querySet.push(`post_status = $${queryValues.length}`);
    }

    if (photo){
        queryValues.push(photo);
        querySet.push(`photo = $${queryValues.length}`);
    }

    if (street){
        queryValues.push(street);
        querySet.push(`street = $${queryValues.length}`);
    }

    if (streetNumber){
        queryValues.push(streetNumber);
        querySet.push(`street_number = $${queryValues.length}`);
    }

    if (addressID){
        queryValues.push(addressID);
        querySet.push(`address_id = $${queryValues.length}`);
    }


    if(queryValues.length > 0){
        queryValues.push(id);
        query += `${querySet.join(", ")} WHERE id = $${queryValues.length} RETURNING *`;
        const result = await SQLClient.query(query, queryValues);
        return result.rows[0];
    } else {
        throw new Error("No field given");
    }
};

export const deletePost = async (SQLClient, {id}) => {
    const {rowCount} = await SQLClient.query("DELETE FROM Post WHERE id = $1", [id]);
    return rowCount > 0;
};

export const readPost = async (SQLClient, {id}) => {
    const {rows} = await SQLClient.query("SELECT * FROM Post WHERE id = $1", [id]);
    return rows[0];
};

export const readMyPosts = async (SQLClient, {clientID}) => {
    const {rows} = await SQLClient.query("SELECT * FROM Post WHERE client_id = $1", [clientID]);
    return rows;
}


export const searchPostByCategory = async (SQLClient,  nameCategory) => {
    const query = "SELECT * FROM Post p INNER JOIN Post_category pc ON p.id = pc.id_ad INNER JOIN Category_product cp ON cp.id_category = pc.id_category WHERE cp.name_category=$1";
    const {rows} = await SQLClient.query(query, [nameCategory]);
    return rows;
};

export const searchPostswithAllCategoriesByCategory = async (SQLClient, {nameCategory}) => {
  const { rows } = await SQLClient.query(`
    SELECT  
      p.id,
      p.post_date,
      p.description,
      p.title,
      p.number_of_places,
      p.post_status,
      p.photo,
      p.street,
      p.street_number,
      p.address_id,
      p.client_id,
      STRING_AGG(c.name_category, ', ') AS categories
    FROM Post_Category pc
    INNER JOIN Post p ON pc.id_ad = p.id
    INNER JOIN Category_product c ON c.id_category = pc.id_category
    WHERE c.name_category=$1
    GROUP BY 
      p.id,
      p.post_date,
      p.description,
      p.title,
      p.number_of_places,
      p.post_status,
      p.photo,
      p.street,
      p.street_number,
      p.address_id,
      p.client_id
  `, [nameCategory]);

  return rows;
};


export const getAllCategoriesFromPostID = async (SQLClient, id) => {
    const query = "SELECT cp.id_category, cp.name_category FROM Category_product cp INNER JOIN Post_category pc ON cp.id_category = pc.id_category WHERE pc.id_ad=$1";
    const {rows} = await SQLClient.query(query, [id]);
    return rows;
}


export const getPosts = async (SQLClient, { city, postStatus, page = 1, limit = 10 }) => {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    const offset = (pageNum - 1) * limitNum;
    
    const conditions = [];
    const values = [];

    if (city) {
        values.push(`%${city}%`);
        conditions.push(`LOWER(a.city) LIKE LOWER($${values.length})`);
    }

    if (postStatus) {
        values.push(postStatus);
        conditions.push(`p.post_status = $${values.length}`);
    }

    const whereClause = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `
        SELECT COUNT(p.id)
        FROM Post p
        JOIN Address a ON p.address_id = a.id${whereClause}
    `;

    try {
        const totalResult = await SQLClient.query(countQuery, values);
        const total = parseInt(totalResult.rows[0].count, 10);
        
        const limitIndex = values.length + 1;
        const offsetIndex = values.length + 2;
        const dataQuery = `
            SELECT 
                p.id, 
                p.title,
                p.address_id,
                p.client_id, 
                p.photo,
                p.post_date,
                (
                    p.number_of_places - (
                        -- Calcul des réservations confirmées pour ce post
                        SELECT COUNT(id) 
                        FROM Reservation 
                        WHERE post_id = p.id 
                        AND reservation_status = 'confirmed'
                    )
                ) AS places_restantes, 
                string_agg(cp.name_category, ', ') AS categories, 
                a.city,
                p.description,
                c.username, 
                p.post_status,
                p.street,
                p.street_number,
                a.postal_code
            FROM Post p
            JOIN Address a ON p.address_id = a.id
            JOIN Client c ON p.client_id = c.id 
            INNER JOIN Post_category pc ON pc.id_ad = p.id
            INNER JOIN Category_product cp ON cp.id_category = pc.id_category
            ${whereClause}
            GROUP BY 
                p.id, 
                p.title, 
                p.number_of_places, 
                a.city, 
                c.username, 
                p.post_status,
                a.postal_code,
                p.street, 
                p.street_number
            LIMIT $${limitIndex} OFFSET $${offsetIndex}
        `;

        values.push(limitNum);
        values.push(offset);
        
        const { rows } = await SQLClient.query(dataQuery, values);

        return {
            rows: rows,
            total: total
        };

    } catch (err) {
        throw new Error(`Erreur SQL dans getPosts : ${err.message}`);
    }
};