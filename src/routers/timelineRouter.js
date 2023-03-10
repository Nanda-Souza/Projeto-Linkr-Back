import { Router } from "express";
import {
  createPost,
  deletePost,
  listPost,
} from "../controllers/timelineController.js";
import validateSchema from "../middlewares/schemaValidation.js";
import { deletePostValidation } from "../middlewares/timelineMiddleware.js";
import { validateToken } from "../middlewares/validateToken.js";
import { timelineSchema } from "../models/timelineSchema.js";

const timelineRouter = Router();

timelineRouter.post(
  "/timeline",
  validateToken,
  validateSchema(timelineSchema),
  createPost
);
timelineRouter.get("/timeline", validateToken, listPost);
timelineRouter.delete(
  "/posts/:id",
  validateToken,
  deletePostValidation,
  deletePost
);

export default timelineRouter;
