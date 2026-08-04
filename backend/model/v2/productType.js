export const readProductCategoryFromID = async (SQLClient, categoryID) => {
    const query = "SELECT category_id, category_name FROM Product_category WHERE category_id = $1";
    const { rows } = await SQLClient.query(query, [categoryID]);
    
    if (rows.length === 0) return null;
    
    return rows[0];
};

export const createProductType = async(SQLClient, categoryName) => {
    const {rows} = await SQLClient.query("INSERT INTO Product_category(category_name) VALUES ($1) RETURNING *",
    [categoryName]);
    
    return rows[0];
}

export const updateProductType = async (SQLClient, { categoryID, categoryName }) => {
    let query = "UPDATE Product_category SET ";
    const querySet = [];
    const queryValues = [];

    if (categoryName) {
        queryValues.push(categoryName);
        querySet.push(`category_name = $${queryValues.length}`);
    }

    if (queryValues.length > 0) {
        queryValues.push(categoryID); 
        query += `${querySet.join(", ")} WHERE category_id = $${queryValues.length} RETURNING *`;

        const results = await SQLClient.query(query, queryValues);
        return results.rows[0];
    } else {
        throw new Error("No field given (Category name)");
    }
};

export const getCategories = async (SQLClient, { categoryName, page = 1, limit = 10 }) => {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    const offset = (pageNum - 1) * limitNum;
    
    const conditions = [];
    const values = [];

    if (categoryName) {
        values.push(`%${categoryName}%`);
        conditions.push(`LOWER(category_name) LIKE LOWER($${values.length})`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';    
    const countQuery = `
        SELECT COUNT(category_id)
        FROM Product_category
        ${whereClause}
    `;
        const totalResult = await SQLClient.query(countQuery, values);
    const total = parseInt(totalResult.rows[0].count, 10);
    const limitIndex = values.length + 1;
    const offsetIndex = values.length + 2;
    
    const dataQuery = `
        SELECT 
            category_id, 
            category_name 
        FROM Product_category
        ${whereClause}
        ORDER BY category_id DESC
        LIMIT $${limitIndex} OFFSET $${offsetIndex}
    `;

    values.push(limitNum);
    values.push(offset);
    
    const { rows } = await SQLClient.query(dataQuery, values);
    
    return {
        rows: rows,
        total: total
    };
};