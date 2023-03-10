import { Router } from "express";
import authRouter from "./authRouter.js";
import likesRouter from "./likesRouter.js";
import timelineRouter from "./timelineRouter.js";
import trendingRouter from "./trendingRouter.js";

const router = Router();

router.use([authRouter, likesRouter, timelineRouter, trendingRouter]);

export default router;
