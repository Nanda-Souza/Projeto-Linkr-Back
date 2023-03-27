import { commentPost, getComments, getIdByToken, getLikeInfo, postDeslike, postLike } from "../repositories/likesRepository.js";

export async function likePost(req, res) {
  const token = res.locals.token;
  const { postId } = req.body;
  const userId = await getIdByToken(token);
  try {
    await postLike(userId.user_id, postId);
    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function deslikePost(req, res) {
  const token = res.locals.token;
  const { postId } = req.params;
  const userId = await getIdByToken(token);
  try {
    await postDeslike(userId.user_id, postId);
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

export async function commentPostController(req, res) {
  const token = res.locals.token;
  const { postId } = req.params;
  const { comment } = req.body;
  const userId = await getIdByToken(token);
  try {
    await commentPost(userId.user_id, postId, comment);
    return res.sendStatus(201);
  } catch (error) {
    
    return res.sendStatus(500);
  }
}

export async function getCommentController(req, res) {
  const { postId } = req.params;
  const token = res.locals.token;
  try {
    const result = await getComments(postId, token);
    return res.status(200).send(result);
  } catch (error) {
    return res.sendStatus(500);
  }
}