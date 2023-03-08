import { Router } from "express";
import { getUserMe, signIn, signUp } from "../controllers/authControllers.js";
import {
  signUpValidation,
  signInValidation,
} from "../middlewares/authMidleware.js";
import validateSchema from "../middlewares/schemaValidation.js";
import { validateToken } from "../middlewares/validateToken.js";
import { signInSchema, signUpSchema } from "../models/authSchema.js";

const authRouter = Router();

authRouter.post(
  "/sign-up",
  validateSchema(signUpSchema),
  signUpValidation,
  signUp
);
authRouter.post(
  "/sign-in",
  validateSchema(signInSchema),
  signInValidation,
  signIn
);
authRouter.get("/users/me", validateToken, getUserMe);

export default authRouter;
