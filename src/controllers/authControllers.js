import {
  createSession,
  createUser,
  getUserByToken,
} from "../repositories/authRepository.js";

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

export async function getUserMe(req, res) {
  const { token } = res.locals;
  try {
    const user = await getUserByToken(token);
    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}
