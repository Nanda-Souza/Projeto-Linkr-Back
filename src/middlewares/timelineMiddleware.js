import { getIdByToken } from "../repositories/likesRepository.js";
import { getPostById } from "../repositories/timelineRepository.js";

export async function userPostValidation(req, res, next) {
  const { id } = req.params;
  const token = res.locals.token;

  console.log("deletePostValidation");
  console.log("id: ", id);
  console.log("token: ", token);

  try {
    const { user_id } = await getIdByToken(token);
    console.log("user_id: ", user_id);
    const post = await getPostById(id);
    console.log("post: ", post);

    if (!post) {
      return res.sendStatus(404);
    }
    if (post.user_id !== user_id) {
      return res.sendStatus(403);
    }

    res.locals.post = post;
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

  next();
}
