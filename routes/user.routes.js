import { Router } from "express";
const userRouter = Router();

userRouter.get("/", (req, res) => res.send("Users fetched"));
userRouter.get("/:id", (req, res) => res.send("Single User fetched"));

export default userRouter;
