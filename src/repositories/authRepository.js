// auth repository
import db from "../config/database.js";

export async function getUserByEmail(email) {
  const result = await db.query(
    `
        SELECT * FROM users
        WHERE email = $1
        `,
    [email]
  );

  return result;
}

export async function createUser({ name, email, img_url, password }) {
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

export async function createSession({ user_id, token }) {
  const result = await db.query(
    `
            INSERT INTO sessions
            (user_id, token)
            VALUES
            ($1, $2)
            RETURNING *
            `,
    [user_id, token]
  );
  return result.rows[0];
}
