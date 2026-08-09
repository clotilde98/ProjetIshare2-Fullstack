export const readReservationsByClientID = async (SQLClient, {id, page, limit}) => {
    
    const offset = (page - 1) * limit;

    const values = [id]; 

    const countQuery = `SELECT COUNT(id) FROM Reservation WHERE client_id = $1`; 
    
    const totalResult = await SQLClient.query(countQuery, values);
    const total = parseInt(totalResult.rows[0].count, 10);

    const dataQuery = `SELECT * FROM Reservation WHERE client_id = $1 ORDER BY reservation_date DESC LIMIT $2 OFFSET $3`; 
    values.push(limit); 
    values.push(offset); 

    const {rows} = await SQLClient.query(dataQuery, values); 
    return {
        rows: rows, 
        total: total
    };
};

export const readReservationsByPostID = async (SQLClient, {id, page, limit}) => {
    
    const offset = (page - 1) * limit;

    const values = [id]; 

    const countQuery = `SELECT COUNT(id) FROM Reservation WHERE post_id = $1`; 

    const totalResult = await SQLClient.query(countQuery, values);
    const total = parseInt(totalResult.rows[0].count, 10);

    const dataQuery = `SELECT * FROM Reservation WHERE post_id = $1 ORDER BY reservation_date DESC LIMIT $2 OFFSET $3`; 

    values.push(limit); 
    values.push(offset);

    const {rows} = await SQLClient.query(dataQuery, values); 
    return {
        rows: rows, 
        total: total
    };
};