import { Router } from "express";
const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => res.send("Get all subscriptions"));
subscriptionRouter.get("/:id", (req, res) => res.send("Single User fetched"));

export default subscriptionRouter;
