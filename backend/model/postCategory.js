

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