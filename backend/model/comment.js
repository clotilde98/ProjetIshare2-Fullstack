

export const deleteComment = async (SQLClient, {id})=>{
    let query="DELETE FROM Comment WHERE id=$1";
    const {rows} = await SQLClient.query(query, [id]);
    return rows > 0;
}

export const createComment = async (SQLClient, { content, idPost, idCostumer }) => {
    const { rows } = await SQLClient.query(
        "INSERT INTO Comment(content, id_post, id_costumer) VALUES ($1, $2, $3) RETURNING *",
        [content, idPost, idCostumer]
    );
    
    return rows[0];
};

export const updateComment = async (SQLClient, { id, content }) => {
    let query = "UPDATE Comment SET ";
    const querySet = [];
    const queryValues = [];

    if (content) {
        queryValues.push(content);
        querySet.push(`content = $${queryValues.length}`);
    }

    if (queryValues.length > 0) {
        if (!id) {
            throw new Error("Missing field: id");
        }
        
        queryValues.push(id); 
        query += `${querySet.join(", ")} WHERE id = $${queryValues.length}`;

        const result = await SQLClient.query(query, queryValues);
        return result.rowCount > 0; 
    } else {
        throw new Error("No updateable field given (content)");
    }
};



export const getComments = async (SQLClient, { commentDate, page = 1, limit = 10 }) => {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    const offset = (pageNum - 1) * limitNum;
    const conditions = [];
    const values = [];

    
    if (commentDate) {
        values.push(`%${commentDate}%`); 
        conditions.push(`TO_CHAR(c.date, 'YYYY-MM-DD') LIKE $${values.length}`);
    }

    const whereClause = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(c.id) AS total
    FROM Comment c
    JOIN Post p ON c.id_post = p.id
    JOIN Client cl ON c.id_costumer = cl.id${whereClause}`; 

    try {
        const countResult = await SQLClient.query(countQuery, values);
        const total = Number(countResult.rows[0].total) || 0;

        const limitIndex = values.length + 1;
        const offsetIndex = values.length + 2; 

        const dataQuery = `SELECT 
            c.id, c.content, c.date, c.id_post, c.id_costumer,
            p.title AS post_title,
            cl.username AS username
        FROM Comment c
        JOIN Post p ON c.id_post = p.id
        JOIN Client cl ON c.id_costumer = cl.id${whereClause}
        ORDER BY c.date DESC, c.id DESC
        LIMIT $${limitIndex} OFFSET $${offsetIndex}`;

        values.push(limitNum);
        values.push(offset);
        
        const dataResult = await SQLClient.query(dataQuery, values);
        const rows = dataResult.rows;

        return { rows, total };

    } catch (err) {
        throw new Error(`Erreur SQL dans getComments : ${err.message}`); 
    }
};