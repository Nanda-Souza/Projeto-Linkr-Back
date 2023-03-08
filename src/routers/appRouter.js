import { Router } from "express";
import authRouter from "./authRouter.js";
import likesRouter from "./likesRouter.js";
import timelineRouter from "./timelineRouter.js";

const router = Router();

router.use([authRouter, likesRouter, timelineRouter]);

export default router;
