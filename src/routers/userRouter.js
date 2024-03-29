import { Router } from "express";
import { followUserById, searchFollowerById, searchUserByName, unfollowUserById, checkFollow } from "../controllers/userController.js";
import { validateToken } from "../middlewares/validateToken.js";

const userRouter = Router()

userRouter.get("/users/", validateToken, searchUserByName)
userRouter.post("/user/:id", validateToken, followUserById)
userRouter.delete("/user/:id", validateToken, unfollowUserById)
userRouter.get("/follow/:id", validateToken, searchFollowerById)
userRouter.get("/is-following", validateToken, checkFollow)


export default userRouter;