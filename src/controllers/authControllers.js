import { createSession, createUser } from "../repositories/authRepository.js";

export async function signUp(req, res) {
  const { signUp } = res.locals;
  try {
    createUser(signUp);
    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  const { session } = res.locals;

  try {
    const { token } = await createSession(session);

    return res.status(200).send({ token });
  } catch (error) {
    return res.status(500).send("server error: " + error);
  }
}
