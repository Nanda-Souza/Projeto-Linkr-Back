// auth controller

import { addUserInDb } from "../repositories/authRepository.js";

export default function signUp(req, res) {
  const { signUp } = res.locals;
  try {
    addUserInDb(signUp);
    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}
