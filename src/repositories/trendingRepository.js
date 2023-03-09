import db from "../config/database.js";

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