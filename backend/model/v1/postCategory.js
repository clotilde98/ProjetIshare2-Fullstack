export const createPostCategory = async (SQLClient, {IDCategory, IDPost}) => {
    const { rows } = await SQLClient.query(
    `INSERT INTO Post_Category (category_id, post_id)
     VALUES ($1, $2)
     RETURNING * `,
    [IDCategory, IDPost]
  );
  
  return rows[0];
};

export const getPostCategories = async (SQLClient, IDPost) => {
    const { rows } = await SQLClient.query(
        `
        SELECT c.category_id AS id_category, c.category_name AS name_category
        FROM Post_category pc
        JOIN Category_product c
        ON pc.category_id = c.category_id
        WHERE pc.post_id = $1
        `,
        [IDPost]
    );

    return rows;
}; // pas utilisé !? 

export const deletePostCategoriesForPostID = async (SQLClient, postID) => {
  const {rowCount} = await SQLClient.query(
    `DELETE FROM Post_Category WHERE post_id = $1`, [postID]
  );
  return rowCount > 0;

}

export const getPostswithAllCategories = async (SQLClient) => {
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
      STRING_AGG(c.category_name, ', ') AS categories
    FROM Post_Category pc
    INNER JOIN Post p ON pc.post_id = p.id
    INNER JOIN Category_product c ON c.category_id = pc.category_id
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
  `);

  return rows;
};