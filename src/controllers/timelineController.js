import { getIdByToken } from "../repositories/likesRepository.js";
import {
  createPostByUser,
  getTimeline,
} from "../repositories/timelineRepository.js";

export async function createPost(req, res) {
  const { url, description } = req.body;
  const token = res.locals.token;

  try {
    const { user_id } = await getIdByToken(token);

    await createPostByUser(url, description, user_id);
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function listPost(req, res) {
  try {
    const result = await getTimeline();
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
