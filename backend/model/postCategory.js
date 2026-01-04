

export const createPostCategory = async (SQLClient, {IDCategory, IDPost}) => {
    const { rows } = await SQLClient.query(
    `INSERT INTO Post_Category (id_category, id_ad)
     VALUES ($1, $2)
     RETURNING * `,
    [IDCategory, IDPost]
  );
  
  return rows[0];
};



export const deletePostCategoriesForPostID = async (SQLClient, postID) => {
  const {rowCount} = await SQLClient.query(
    `DELETE FROM Post_Category WHERE id_ad = $1`, [postID]
  );
  return rowCount > 0;

}

export const getPostswithAllCategories = async (SQLClient, excludedClientId, userCity = null, userStreet = null) => {
  const query = `
    SELECT   
      p.id, 
      p.post_date, 
      p.title, 
      p.photo, 
      p.street,
      a.city,
      STRING_AGG(c.name_category, ', ') AS categories,
      (CASE 
        WHEN $2::VARCHAR IS NULL OR $3::VARCHAR IS NULL THEN 2
        -- Priorité 0 : Même ville ET même rue
        WHEN UPPER(a.city) = UPPER($2::VARCHAR) AND UPPER(p.street) = UPPER($3::VARCHAR) THEN 0 
        -- Priorité 1 : Même ville
        WHEN UPPER(a.city) = UPPER($2::VARCHAR) THEN 1 
        -- Priorité 2 : Autre ville ou pas de match
        ELSE 2 
      END) AS proximity_score
    FROM Post p
    INNER JOIN Address a ON p.address_id = a.id
    LEFT JOIN Post_category pc ON p.id = pc.id_ad
    LEFT JOIN Category_product c ON c.id_category = pc.id_category
    WHERE p.client_id != $1 
      AND p.post_status = 'available'
    GROUP BY 
      p.id, p.post_date, p.title, p.photo, p.street, a.city
    ORDER BY 
      proximity_score ASC, 
      p.post_date DESC;
  `;

  const values = [excludedClientId, userCity || null, userStreet || null];
  const { rows } = await SQLClient.query(query, values);

  return rows;
};