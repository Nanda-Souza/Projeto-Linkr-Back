import { Router } from "express";
import { deslikePost, getLikeInfoController, likePost } from "../controllers/likesControllers";
import validateSchema from "../middlewares/schemaValidation";
import { validateToken } from "../middlewares/validateToken";
import { likeSchema } from "../models/likeSchema";

const likesRouter = Router();

likesRouter.post("/like", validateToken, validateSchema(likeSchema), likePost);
likesRouter.delete("/like", validateToken, validateSchema(likeSchema), deslikePost);
likesRouter.get("/like", validateToken, validateSchema(likeSchema), getLikeInfoController);

export default likesRouter;