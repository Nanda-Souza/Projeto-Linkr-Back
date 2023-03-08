import { Router } from "express";
import authRouter from "./authRouter.js";
import likesRouter from "./likesRouter.js";

const router = Router();

router.use([authRouter, likesRouter]);

export default router;
