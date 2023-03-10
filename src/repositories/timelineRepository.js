import db from "../config/database.js";
import urlMetadata from "url-metadata";
import { getLikeInfo } from "./likesRepository.js";

export async function getTimeline(userId) {
  const result = await db.query(`
    SELECT 
      posts.created_at,
      users.name AS user_name,
      users.img_url AS user_img_url,
      posts.description AS post_comment,
      posts.id AS post_id,
      posts.link AS post_link,
      posts.user_id AS user_id
    FROM users
    JOIN posts ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
    LIMIT 20;
  `);

  const postIds = result.rows.map((i) => i.post_id)
  const likesArr = await getLikeInfo(postIds, userId)
  const rowsWithMetadata = await Promise.all(
    result.rows.map(async (row, index) => {
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
        likeInfo: likesArr[index]
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

  return result;
}
