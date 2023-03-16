import { Router } from "express";
import authRouter from "./authRouter.js";
import likesRouter from "./likesRouter.js";
import timelineRouter from "./timelineRouter.js";
import trendingRouter from "./trendingRouter.js";
import userRouter from "./userRouter.js";

const router = Router();

router.use([authRouter, likesRouter, timelineRouter, trendingRouter, userRouter]);

export default router;
