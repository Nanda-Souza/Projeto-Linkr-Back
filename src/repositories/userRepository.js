import db from "../config/database.js";

export async function searchUser(search){
   const result = await db.query(`
    SELECT users.name, users.id, users.img_url FROM users
    WHERE LOWER(name) LIKE LOWER($1)
   `, [`%${search}%`])

   return result.rows
}

export async function followUser(userId, id){
   const result = await db.query(`
      INSERT INTO follows (user_id, follow_id)
      VALUES ($1, $2)
   `, [userId, id])

   return result;
}

export async function unfollowUser(userId, id){
   const result = await db.query(`
   DELETE FROM follows
   WHERE user_id = $1
   AND follow_id = $2
   `, [userId, id])

   return result
}

export async function searchFollower(userId, id){
   const result = await db.query(`
      SELECT * FROM follows
      WHERE user_id = $1
      AND follow_id = $2
   `, [userId, id])

   console.log("O seguidor é:", result.rows[0])

   return result
}