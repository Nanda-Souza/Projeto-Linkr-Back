import { Router } from "express";
import { commentPostController, deslikePost, getCommentController, getLikeInfoController, likePost } from "../controllers/likesControllers.js";
import validateSchema from "../middlewares/schemaValidation.js";
import { validateToken } from "../middlewares/validateToken.js";
import { commentSchema } from "../models/commentSchema.js";
import { likeSchema } from "../models/likeSchema.js";

const likesRouter = Router();

likesRouter.post("/like", validateToken, validateSchema(likeSchema), likePost);
likesRouter.delete("/like/:postId", validateToken, deslikePost);
likesRouter.get("/like", validateToken, validateSchema(likeSchema), getLikeInfoController);
likesRouter.post("/comment/:postId", validateToken, validateSchema(commentSchema), commentPostController);
likesRouter.get("/comment/:postId", validateToken, getCommentController);

export default likesRouter;