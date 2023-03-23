import {
  getIdByToken,
  deletePostLikes,
} from "../repositories/likesRepository.js";
import {
  createPostByUser,
  deletePostById,
  getTimeline,
  getUserPosts,
  updatePostById,
} from "../repositories/timelineRepository.js";
import { deletePostHashtags } from "../repositories/trendingRepository.js";

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
  let { offset } = req.query;

  if (!offset) {
    offset = 0;
  } else {
    offset = Number(offset);
  }

  const token = res.locals.token;
  const userId = await getIdByToken(token);
  try {
    const result = await getTimeline(userId, offset);
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function listUserPost(req, res) {
  const { id } = req.params;
  const token = res.locals.token;
  const userId = await getIdByToken(token);
  try {
    const result = await getUserPosts(userId, id);
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function deletePost(req, res) {
  const { id } = res.locals.post;
  try {
    await deletePostLikes(id);
    await deletePostHashtags(id);

    await deletePostById(id);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function updatePost(req, res) {
  const { description } = req.body;
  const { id, user_id } = res.locals.post;
  try {
    await updatePostById(id, user_id, description);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
