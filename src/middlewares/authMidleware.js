import { getUserByEmail } from "../repositories/authRepository.js";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

export async function signUpValidation(req, res, next) {
  const { name, email, img_url, password } = req.body;

  try {
    if ((await getUserByEmail(email)).rowCount !== 0)
      return res.sendStatus(409);

    // password crypt
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, salt);

    res.locals.signUp = {
      name,
      email,
      img_url,
      password: passHash,
    };

    next();
  } catch (error) {
    return res.status(500).send("Server error: " + error);
  }
}

export async function signInValidation(req, res, next) {
  const { email, password } = req.body;
  try {
    const result = await getUserByEmail(email);

    const invalidUser = result.rowCount === 0;
    if (invalidUser) return res.sendStatus(401);

    const user = result.rows[0];

    const wrongPassword = !(await bcrypt.compare(password, user.password));

    if (wrongPassword) return res.sendStatus(401);

    res.locals.session = {
      user_id: user.id,
      token: uuidV4(),
    };

    next();
  } catch (error) {
    return res.status(500).send("server error: " + error);
  }
}
