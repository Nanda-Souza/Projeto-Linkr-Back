// auth repository
import db from "../config/database.js";

export async function userAlreadyExists(email) {
  const result = await db.query(
    `
        SELECT * FROM users
        WHERE email = $1
        `,
    [email]
  );

  return result.rowCount !== 0;
}

export async function addUserInDb({ name, email, img_url, password }) {
  const result = await db.query(
    `
            INSERT INTO users (name, email, img_url, password)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
    [name, email, img_url, password]
  );

  return result.rows[0];
}
