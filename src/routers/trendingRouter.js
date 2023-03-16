import { Router } from "express";
import { listTopTrends,
         listPostTrends } from "../controllers/trendingController.js";
import { validateToken } from "../middlewares/validateToken.js";
import validateSchema from "../middlewares/schemaValidation.js";
import { trendSchema } from "../models/trendSchema.js";

const trendingRouter = Router();

trendingRouter.get("/top-trending", validateToken, listTopTrends);

trendingRouter.post("/list-trends", validateToken, validateSchema(trendSchema), listPostTrends);

export default trendingRouter;
