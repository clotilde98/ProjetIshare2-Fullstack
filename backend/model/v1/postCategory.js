export const createPostCategory = async (SQLClient, {IDCategory, IDPost}) => {
    const { rows } = await SQLClient.query(
    `INSERT INTO Post_Category (category_id, post_id)
     VALUES ($1, $2)
     RETURNING * `,
    [IDCategory, IDPost]
  );
  
  return rows[0];
};

export const deletePostCategoriesForPostID = async (SQLClient, postID) => {
  const {rowCount} = await SQLClient.query(
    `DELETE FROM Post_Category WHERE post_id = $1`, [postID]
  );
  return rowCount > 0;

}