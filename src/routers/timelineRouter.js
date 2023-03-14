import { Router } from "express";
import {
  createPost,
  deletePost,
  listPost,
  listUserPost,
  updatePost,
} from "../controllers/timelineController.js";
import validateSchema from "../middlewares/schemaValidation.js";
import { userPostValidation } from "../middlewares/timelineMiddleware.js";
import { validateToken } from "../middlewares/validateToken.js";
import { timelineSchema, updatePostSchema } from "../models/timelineSchema.js";

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
  userPostValidation,
  deletePost
);
timelineRouter.patch(
  "/posts/:id",
  validateToken,
  validateSchema(updatePostSchema),
  userPostValidation,
  updatePost
);

timelineRouter.get("/user/:id", validateToken, listUserPost)

export default timelineRouter;
