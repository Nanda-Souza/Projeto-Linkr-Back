import { Router } from "express";
import signUp from "../controllers/authControllers.js";
import { signUpValidation } from "../middlewares/authMidleware.js";
import validateSchema from "../middlewares/schemaValidation.js";
import { signUpSchema } from "../models/authSchema.js";

const router = Router();

router.post("/sign-up", validateSchema(signUpSchema), signUpValidation, signUp);
router.post("/sign-in");

export default router;
