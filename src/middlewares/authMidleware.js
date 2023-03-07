import { userAlreadyExists } from "../repositories/authRepository.js";

export async function signUpValidation(req, res, next) {
  const { name, email, img_url, password } = req.body;
  console.log(req.body);

  try {
    if (await userAlreadyExists(email)) return res.sendStatus(409);

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
