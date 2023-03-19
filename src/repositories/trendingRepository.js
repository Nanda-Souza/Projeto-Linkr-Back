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
      JOIN post_hashtags ON post_hashtags.post_id = posts.id
      JOIN hashtags ON hashtags.id = post_hashtags.hashtag_id
      WHERE hashtags.name = $1 
      ORDER BY posts.created_at DESC
      LIMIT 20`,
      [trendName]
      );
    
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
      
  
    return rowsWithMetadata;
  }

  export async function createHashtag(description, post_id) {
    console.log(post_id, description) 
    
  }