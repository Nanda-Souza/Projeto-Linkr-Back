import { Router } from "express";
import { deslikePost, getLikeInfoController, likePost } from "../controllers/likesControllers.js";
import validateSchema from "../middlewares/schemaValidation.js";
import { validateToken } from "../middlewares/validateToken.js";
import { likeSchema } from "../models/likeSchema.js";

const likesRouter = Router();

likesRouter.post("/like", validateToken, validateSchema(likeSchema), likePost);
likesRouter.delete("/like", validateToken, validateSchema(likeSchema), deslikePost);
likesRouter.get("/like", validateToken, validateSchema(likeSchema), getLikeInfoController);

export default likesRouter;