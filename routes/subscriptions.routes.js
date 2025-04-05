import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import {
  createSubscription,
  getUserSubscription,
} from "../controllers/subscription.controller.js";
const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => res.send("Get all subscriptions"));
subscriptionRouter.get("/user/:id", authorize, getUserSubscription);
subscriptionRouter.post("/", authorize, createSubscription);

export default subscriptionRouter;
