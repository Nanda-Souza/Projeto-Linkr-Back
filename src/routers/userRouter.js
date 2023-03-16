import { Router } from "express";
import { searchUserByName } from "../controllers/userController.js";
import { validateToken } from "../middlewares/validateToken.js";

const userRouter = Router()

userRouter.get("/users/", validateToken, searchUserByName)


export default userRouter