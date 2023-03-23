import db from "../config/database.js";
import urlMetadata from "url-metadata";
import { getLikeInfo } from "./likesRepository.js";
import { createHashtag } from "./trendingRepository.js";

export async function getTimeline(userId, offset) {
  let offsetQuery = "";

  if (offset) {
    offsetQuery = `WHERE posts.id < ${offset}`;
  }

  const result = await db.query(
    `
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
    ${offsetQuery}
    ORDER BY posts.created_at DESC
    LIMIT 10;
  `
  );

  const postIds = result.rows.map((i) => i.post_id);
  const likesArr = await getLikeInfo(postIds, userId);
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
        likeInfo: likesArr[index],
      };
    })
  );

  return rowsWithMetadata;
}

export async function createPostByUser(url, description, userId) {
  const result = await db.query(
    `
    INSERT INTO posts 
    (link, description, user_id)
    VALUES ($1, $2, $3) RETURNING id
    `,
    [url, description, userId]
  );

  if (description.indexOf("#") > -1) {
    const post_id = result.rows[0].id;

    createHashtag(post_id, description);
  }

  return result;
}

export async function getPostById(id) {
  const result = await db.query(
    `
    SELECT * FROM posts
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
}

export async function deletePostById(id) {
  const result = await db.query(
    `
    DELETE FROM posts
    WHERE id = $1
    `,
    [id]
  );

  return result;
}

export async function updatePostById(id, user_id, description) {
  const result = await db.query(
    `
    UPDATE posts
    SET description = $1
    WHERE id = $2
    AND user_id = $3
  `,
    [description, id, user_id]
  );

  console.log(result);

  return result;
}

export async function getUserPosts(userId, profileId) {
  const userResult = await db.query(
    `
    SELECT name, img_url
    FROM users
    WHERE id = $1;
  `,
    [profileId]
  );

  const user = userResult.rows[0] || {};
  if (!user) {
    return null;
  }

  const result = await db.query(
    `
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
  WHERE users.id = $1
  ORDER BY posts.created_at DESC;
  `,
    [profileId]
  );

  const postIds = result.rows.map((i) => i.post_id);
  const likesArr = await getLikeInfo(postIds, userId);
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
        likeInfo: likesArr[index],
      };
    })
  );

  return {
    user,
    posts: rowsWithMetadata,
  };
}
