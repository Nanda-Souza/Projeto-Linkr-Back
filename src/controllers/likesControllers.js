import {
  getIdByToken,
  getLikeInfo,
  postDeslike,
  postLike,
} from "../repositories/likesRepository.js";

export async function likePost(req, res) {
  const token = res.locals.token;
  const { postId } = req.body;
  const userId = getIdByToken(token);
  try {
    await postLike(userId, postId);
    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function deslikePost(req, res) {
  const token = res.locals.token;
  const { postId } = req.body;
  const userId = getIdByToken(token);
  try {
    await postDeslike(userId, postId);
    return res.sendStatus(204);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getLikeInfoController(req, res) {
  const { postId } = req.body;
  try {
    const result = await getLikeInfo(postId);
    return res.status(200).send(result);
  } catch (error) {
    return res.sendStatus(500);
  }
}
