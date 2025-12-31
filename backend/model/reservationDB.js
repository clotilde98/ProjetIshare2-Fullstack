
export const createReservation = async (SQLClient, clientID, {postID}) => {
    const { rows } = await SQLClient.query(
    `INSERT INTO Reservation (post_id, client_id)
     VALUES ($1, $2)
     RETURNING * `,
    [postID, clientID]
    );
  return rows[0];
};

export const readReservation = async (SQLClient, {id}) => {
    const {rows} = await SQLClient.query("SELECT * FROM Reservation WHERE id = $1", [id]);
    return rows[0];
};

export const readMyReservations = async (SQLClient, {clientID}) => {
    const query = `
        SELECT 
            r.id AS reservation_id,
            p.id AS post_id,
            p.title,
            p.street,
            p.street_number,
            p.photo,
            a.city,
            a.postal_code,
            c.username AS owner_name,
            c.photo AS owner_photo
        FROM Reservation r
        JOIN Post p ON r.post_id = p.id
        JOIN Address a ON p.address_id = a.id
        JOIN Client c ON p.client_id = c.id
        WHERE r.client_id = $1
        ORDER BY r.reservation_date DESC
    `;
    const {rows} = await SQLClient.query(query, [clientID]);
    return rows;
};

export const readReservationsByClientID = async (SQLClient, {id}) => {
    const {rows} = await SQLClient.query("SELECT * FROM reservation WHERE client_id = $1", [id]);
    return rows;
};

export const readReservationByClientIDAndByPostID = async (SQLClient, {clientID, postID}) => {
    const {rows} = await SQLClient.query("SELECT * FROM Reservation WHERE client_id = $1 AND post_id = $2", [clientID, postID]);
    return rows[0];
};

export const readReservationsByPostID = async (SQLClient, {id}) => {
    const {rows} = await SQLClient.query("SELECT * FROM Reservation WHERE post_id = $1", [id]);
    return rows;
};


export const updateReservation = async(SQLClient, {id, clientID,postID, reservationStatus}) => {
    let query = "UPDATE reservation SET ";
    const querySet = [];
    const queryValues = [];

    if (clientID){
        queryValues.push(clientID);
        querySet.push(`client_id = $${queryValues.length}`);
    }
    if (postID){
        queryValues.push(postID);
        querySet.push(`post_id = $${queryValues.length}`);
    }

    if (reservationStatus){
        queryValues.push(reservationStatus);
        querySet.push(`reservation_status = $${queryValues.length}`);
    }


    if(queryValues.length > 0){
        queryValues.push(id);
        query += `${querySet.join(", ")} WHERE id = $${queryValues.length} RETURNING *`;
        const result = await SQLClient.query(query, queryValues);
        return result.rows[0] || null;
    } else {
        throw new Error("No field given");
    }
};

export const deleteReservation = async (SQLClient, {id}) => {
    const {rowCount} = await SQLClient.query("DELETE FROM Reservation WHERE id = $1", [id]);
    return rowCount > 0;
};



export const getReservations = async (SQLClient, { username, reservationStatus, page = 1, limit = 10 }) => {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const offset = (pageNum - 1) * limitNum;
    
    const conditions = [];
    const values = []; 

    if (username) {
        values.push(`%${username}%`); 
        conditions.push(`LOWER(c.username) LIKE LOWER($${values.length})`);
    }
    
    if (reservationStatus) {
        values.push(reservationStatus); 
        conditions.push(`r.reservation_status = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    
    const countQuery = `SELECT COUNT(r.id) AS total
    FROM Reservation r
    INNER JOIN Client c ON c.id = r.client_id
    INNER JOIN Post p ON p.id = r.post_id
    ${whereClause}`;

    try {
        const countResult = await SQLClient.query(countQuery, values);
        const total = parseInt(countResult.rows[0].total, 10);
        
        const limitIndex = values.length + 1;
        const offsetIndex = values.length + 2; 



        const dataQuery = `SELECT 
            r.id, 
            p.title, 
            p.id as post_id,
            c.username, 
            c.id as client_id,
            r.reservation_date, 
            r.reservation_status
        FROM Reservation r
        INNER JOIN Client c ON c.id = r.client_id
        INNER JOIN Post p ON p.id = r.post_id
        ${whereClause}
        ORDER BY r.reservation_date DESC
        LIMIT $${limitIndex} OFFSET $${offsetIndex}`;

        values.push(limitNum);
        values.push(offset);
        
        const dataResult = await SQLClient.query(dataQuery, values);
        const rows = dataResult.rows;

        return { rows, total }; 

    } catch (err) {
        throw new Error(`Erreur SQL dans getReservations : ${err.message}`); 
    }
};