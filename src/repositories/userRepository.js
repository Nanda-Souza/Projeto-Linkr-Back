import db from "../config/database.js";

export async function searchUser(search, userId){
   const result = await db.query(`
    SELECT users.name, users.id, users.img_url FROM users
    WHERE LOWER(name) LIKE LOWER($1)
   `, [`%${search}%`])

   return result.rows
}