import db from "../config/database.js";
export async function postLike(userId, postId) {
    await db.query(
      `
          INSERT INTO likes (user_id, post_id) VALUES($1, $2)
       `,
      [userId, postId]
    );
  
    return;
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

  export async function getLikeInfo(postId) {
    const result = await db.query(
        `SELECT COUNT(*), array_agg(u.name) FROM likes l JOIN users u ON l.user_id = u.id WHERE l.post_id = $1 LIMIT 2;`,
        [postId]
      );
    const obj = {
        likes: result.rows[0].count,
        users: result.rows[0].array_agg,
      }
      return obj;
  }

  