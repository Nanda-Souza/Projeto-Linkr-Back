import db from "../config/database.js";
import urlMetadata from "url-metadata";
import { getLikeInfo } from "./likesRepository.js";

export async function getTopTrends() {
  const result = await db.query(`
        SELECT 
		    h.name as "trendName",			
		    COUNT(h.name) AS "threndingCount"
        FROM hashtags h
        JOIN post_hashtags hr
        ON h.id = hr.hashtag_id
        GROUP BY h.name, h.id
        ORDER BY "threndingCount" DESC LIMIT 10
      `);

  return result;
}

export async function getPostTrends(trendName, userId) {
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
      JOIN post_hashtags ON post_hashtags.post_id = posts.id
      JOIN hashtags ON hashtags.id = post_hashtags.hashtag_id
      WHERE hashtags.name = $1 
      ORDER BY posts.created_at DESC
      LIMIT 20`,
    [trendName]
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

export async function createHashtag(post_id, description) {
  const regex = /#(\w+)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(description)) !== null) {
    matches.push(match[1]);
  }

  for (let i = 0; i < matches.length; i = i + 1) {
    try {
      const checkHash = await db.query(
        `SELECT id FROM hashtags WHERE name = $1;`,
        [matches[i]]
      );

      if (checkHash.rowCount === 0) {
        const newHash = await db.query(
          `
                INSERT INTO hashtags 
                (name)
                VALUES ($1) RETURNING id
                `,
          [matches[i]]
        );

        const hashtag_id = newHash.rows[0].id;

        await db.query(
          `
                INSERT INTO post_hashtags 
                (post_id, hashtag_id)
                VALUES ($1, $2)
                `,
          [post_id, hashtag_id]
        );
      } else {
        const hashtag_id = checkHash.rows[0].id;

        await db.query(
          `
            INSERT INTO post_hashtags 
            (post_id, hashtag_id)
            VALUES ($1, $2)
            `,
          [post_id, hashtag_id]
        );
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

export async function deletePostHashtags(post_id) {
  await db.query(
    `
      DELETE FROM post_hashtags 
      WHERE post_id = $1
      `,
    [post_id]
  );

  return;
}
