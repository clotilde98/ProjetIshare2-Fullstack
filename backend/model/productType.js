export const readCategoryProductFromID = async (SQLClient, idCategory) => {
    const query = "SELECT id_category, name_category FROM Category_product WHERE id_category = $1";
    const { rows } = await SQLClient.query(query, [idCategory]);
    
    if (rows.length === 0) return null;
    
    return rows[0];
};

export const createTypeProduct = async(SQLClient, {nameCategory}) => {
 const {rows}=await SQLClient.query("INSERT INTO Category_product(name_category) VALUES ($1) RETURNING *",
     [nameCategory]
 );
 return rows[0];
}

export const updateTypeProduct = async (SQLClient, { idCategory, nameCategory }) => {
    let query = "UPDATE Category_product SET ";
    const querySet = [];
    const queryValues = [];

    if (nameCategory) {
        queryValues.push(nameCategory);
        querySet.push(`name_category = $${queryValues.length}`);
    }

    if (queryValues.length > 0) {
        queryValues.push(idCategory); 
        query += `${querySet.join(", ")} WHERE id_category = $${queryValues.length} RETURNING *`;

        const results = await SQLClient.query(query, queryValues);
        return results.rows[0];
    } else {
        throw new Error("No field given (Category name)");
    }
};


export const deleteTypeProduct=async(SQLClient, {idCategory})=> {
  
   let query="DELETE FROM Category_product WHERE id_category=$1";
   const result = await SQLClient.query(query, [idCategory]); 
   return result.rowCount ; 
}



export const getCategories = async (SQLClient, { nameCategory, page = 1, limit = 10 }) => {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    const offset = (pageNum - 1) * limitNum;
    
    const conditions = [];
    const values = [];

    if (nameCategory) {
        values.push(`%${nameCategory}%`);
        conditions.push(`LOWER(name_category) LIKE LOWER($${values.length})`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';    
    const countQuery = `
        SELECT COUNT(id_category)
        FROM Category_product
        ${whereClause}
    `;
        const totalResult = await SQLClient.query(countQuery, values);
    const total = parseInt(totalResult.rows[0].count, 10);
    const limitIndex = values.length + 1;
    const offsetIndex = values.length + 2;
    
    const dataQuery = `
        SELECT 
            id_category, 
            name_category 
        FROM Category_product
        ${whereClause}
        ORDER BY id_category DESC
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