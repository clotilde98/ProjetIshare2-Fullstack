
export const getTotalPosts = async (SQLClient) => {
    const query = 'SELECT COUNT(id) AS totalPost FROM Post;';
    const { rows } = await SQLClient.query(query);
    return parseInt(rows[0].totalpost);
};


export const getTotalReservations = async (SQLClient) => {
    const query = 'SELECT COUNT(id) AS totalReservation FROM Reservation;';
    const { rows } = await SQLClient.query(query);
    return parseInt(rows[0].totalreservation);
};


export const getTotalConfirmedReservations = async (SQLClient) => {
    const CONFIRMED_STATUS = 'withdrawal'; 
    const query = `
        SELECT COUNT(id) AS total 
        FROM Reservation 
        WHERE reservation_status = $1;
    `;
    const { rows } = await SQLClient.query(query, [CONFIRMED_STATUS]);
    return parseInt(rows[0].total);
};


export const getTotalUsers = async (SQLClient) => {
    const query = 'SELECT COUNT(id) AS totalClient FROM Client;';
    const { rows } = await SQLClient.query(query);
    return parseInt(rows[0].totalclient);
};