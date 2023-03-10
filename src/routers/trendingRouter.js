import { Router } from "express";
import { listTopTrends } from "../controllers/trendingController.js";
//import validateSchema from "../middlewares/schemaValidation.js";
import { validateToken } from "../middlewares/validateToken.js";
//import { timelineSchema } from "../models/timelineSchema.js";

const trendingRouter = Router();

trendingRouter.get("/top-trending", validateToken, listTopTrends);

export default trendingRouter;
