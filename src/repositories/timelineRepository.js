import db from "../config/database.js";
import urlMetadata from "url-metadata";

export async function getTimeline() {
  const result = await db.query(`
    SELECT 
      users.name AS user_name,
      users.img_url AS user_img_url,
      posts.description AS post_comment,
      posts.id AS post_id,
      posts.link AS post_link,
      posts.user_id AS user_id
    FROM users
    JOIN posts ON posts.user_id = users.id
    LIMIT 20;
  `);

  const rowsWithMetadata = await Promise.all(
    result.rows.map(async (row) => {
      const { description, image, url, title } = await urlMetadata(
        row.post_link,
        { description: true, image: true, url: true, title: true }
      );
      return {
        ...row,
        post_description: description,
        post_image: image,
        post_url: url,
        post_title: title,
      };
    })
  );

  console.log(rowsWithMetadata);

  return rowsWithMetadata;
}

export async function createPostByUser(url, description, userId) {
  const result = await db.query(
    `
    INSERT INTO posts 
    (link, description, user_id)
    VALUES ($1, $2, $3)
    `,
    [url, description, userId]
  );
  await db.query(
    `
  UPDATE posts
  SET description = $1,
    link = $2
  WHERE user_id = $3 
  `,
    [description, url, userId]
  );
  return result;
}
