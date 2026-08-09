export const searchPostsByCategory = async (SQLClient,  {categoryName, page, limit}) => {
    const pageNum = parseInt(page); 
    const limitNum = parseInt(limit); 
    const offset = (pageNum - 1) * limitNum;

    const values = [categoryName];

    const countQuery = `
        SELECT COUNT(DISTINCT p.id)
        FROM Post p
        INNER JOIN Post_category pc ON pc.post_id = p.id
        INNER JOIN Product_category cp ON cp.category_id = pc.category_id
        WHERE cp.category_name = $1
    `;

    try {
        const totalResult = await SQLClient.query(countQuery, values);
        const total = parseInt(totalResult.rows[0].count, 10);

        const limitIndex = values.length + 1;
        const offsetIndex = values.length + 2;
        const dataQuery = `
            SELECT p.*
            FROM Post p
            INNER JOIN Post_category pc ON pc.post_id = p.id
            INNER JOIN Product_category cp ON cp.category_id = pc.category_id
            WHERE cp.category_name = $1
            ORDER BY p.post_date DESC
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
        throw new Error(`SQL error in searchPostByCategory: ${err.message}`);
    }

};