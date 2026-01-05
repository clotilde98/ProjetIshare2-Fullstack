export const createPostCategory = async (SQLClient, {IDCategory, IDPost}) => {
    const { rows } = await SQLClient.query(
    `INSERT INTO Post_Category (id_category, id_ad)
     VALUES ($1, $2)
     RETURNING * `,
    [IDCategory, IDPost]
  );
  
  return rows[0];
};



export const getPostCategories = async (SQLClient, { IDPost }) => {
    const { rows } = await SQLClient.query(
        `
        SELECT c.id_category, c.name_category
        FROM Post_category pc
        JOIN Category_product c
        ON pc.id_category = c.id_category
        WHERE pc.id_ad = $1
        `,
        [IDPost]
    );

    return rows;
};





export const deletePostCategoriesForPostID = async (SQLClient, postID) => {
  const {rowCount} = await SQLClient.query(
    `DELETE FROM Post_Category WHERE id_ad = $1`, [postID]
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
      STRING_AGG(c.name_category, ', ') AS categories
    FROM Post_Category pc
    INNER JOIN Post p ON pc.id_ad = p.id
    INNER JOIN Category_product c ON c.id_category = pc.id_category
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