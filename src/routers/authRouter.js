import { Router } from "express";
import { signIn, signUp } from "../controllers/authControllers.js";
import {
  signUpValidation,
  signInValidation,
} from "../middlewares/authMidleware.js";
import validateSchema from "../middlewares/schemaValidation.js";
import { signInSchema, signUpSchema } from "../models/authSchema.js";

const router = Router();

router.post("/sign-up", validateSchema(signUpSchema), signUpValidation, signUp);
router.post("/sign-in", validateSchema(signInSchema), signInValidation, signIn);

export default router;
