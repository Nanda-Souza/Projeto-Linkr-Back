import db from "../config/database.js";

export async function getTimeline() {
  const result = await db.query(`
    SELECT users.name,
    users.img_url,
    posts.link,
    posts.description,
    users.id,
    posts.user_id
    FROM users
    JOIN posts
    ON posts.user_id = users.id
    LIMIT 20
    `);

  return result.rows;
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

  return result;
}
