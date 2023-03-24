import db from "../config/database.js";

export async function searchUser(search, userId){
   const result = await db.query(`
   SELECT users.name, users.id, users.img_url, true as followed
   FROM follows
   LEFT JOIN users ON follows.follow_id = users.id
   WHERE follows.user_id = $1 AND LOWER(users.name) LIKE LOWER($2)
   
   UNION ALL
   
   SELECT users.name, users.id, users.img_url, false as followed
   FROM users
   WHERE users.id NOT IN (
     SELECT follow_id FROM follows WHERE user_id = $1
   ) AND LOWER(users.name) LIKE LOWER($2)
   `, [userId, `%${search}%`])
   

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

   return result
}