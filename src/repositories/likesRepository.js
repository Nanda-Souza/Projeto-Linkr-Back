import db from "../config/database.js";
export async function postLike(userId, postId) {
  
    const result = await db.query(
      `
          INSERT INTO likes (user_id, post_id) VALUES($1, $2)
       `,
      [userId, postId]
    );
    
    return result;
  }

  export async function getIdByToken(token) {
    const result = await db.query(
        `
            SELECT user_id FROM sessions
            WHERE token = $1
            `,
        [token]
      );
    
      return result.rows[0];
  }

  export async function postDeslike(userId, postId) {
    await db.query(
      `
          DELETE FROM likes WHERE user_id = $1 AND post_id = $2
       `,
      [userId, postId]
    );
  
    return;
  }

  export async function getLikeInfo(postIds, userId) {
      const result = await db.query(`SELECT 
      p.id AS post_id, 
      COALESCE(COUNT(l.*), 0) AS total_likes, 
      (
        SELECT COALESCE(array_agg(u.name) , ARRAY[]::varchar[])
        FROM likes l2
        JOIN users u ON u.id = l2.user_id
        WHERE l2.post_id = p.id
        OFFSET 0
        LIMIT 3
      ) AS users_liked, 
      bool_or(l.user_id = $1) AS has_liked
    FROM 
      posts p
      LEFT JOIN likes l ON p.id = l.post_id
    WHERE 
      p.id = ANY($2::int[])
    GROUP BY 
      p.id;
    
  `,[userId.user_id, postIds])
  
      return result.rows;
  }

  