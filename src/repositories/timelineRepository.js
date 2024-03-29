import db from "../config/database.js";
import urlMetadata from "url-metadata";
import {
  deletePostComments,
  deletePostLikes,
  getLikeInfo,
  getNumberOfComments,
  getNumberOfReposts,
} from "./likesRepository.js";
import { createHashtag, deletePostHashtags } from "./trendingRepository.js";

export async function getTimeline(userId, offset, limit) {
  let offsetQuery = "";
  let limitQuery = "";

  if (limit) {
    limitQuery = `LIMIT ${limit}`;
    if (offset) {
      offsetQuery = `WHERE posts.id < ${offset}`;
    }
  }

  if (offset && !limit) {
    offsetQuery = `WHERE posts.id > ${offset}`;
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
      posts.user_id AS user_id,
      posts.is_repost,
      posts.original_post_id
    FROM users
    JOIN posts ON posts.user_id = users.id
    ${offsetQuery}
    AND
    users.id 
	  IN (SELECT follow_id FROM follows WHERE user_id = $1
      UNION ALL
	      SELECT id as follow_id FROM users WHERE id = $1)
    ORDER BY posts.created_at DESC
    ${limitQuery};`,
    [userId.user_id]
  );

  const postIds = result.rows.map((i) => i.post_id);
  const likesArr = await getLikeInfo(postIds, userId);
  const commentCount = await getNumberOfComments(postIds);
  const shareCount = await getNumberOfReposts(postIds);
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
        commentCount: commentCount[index],
        shareCount: shareCount[index],
      };
    })
  );

  return rowsWithMetadata;
}

export async function createPostByUser(
  url,
  description,
  userId,
  repost,
  originalId
) {
  if (repost === undefined) {
    repost = false;
  }

  const result = await db.query(
    `
    INSERT INTO posts 
    (link, description, user_id, is_repost, original_post_id)
    VALUES ($1, $2, $3, $4, $5) RETURNING id
    `,
    [url, description, userId, repost, originalId]
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
  await deletePostLikes(id);
  await deletePostHashtags(id);
  await deletePostComments(id);

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
