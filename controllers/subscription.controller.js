import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscriptions.models.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user.id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/remainder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: subscription,
      workflowRunId,
    });
  } catch (error) {
    next(error);
  }
};
export const getUserSubscription = async (req, res, next) => {
  try {
    //check if the user is same as the one in the token
    if (req.user.id !== req.params.id) {
      const error = new Error(
        "You are not authorized to view this subscription"
      );
      error.status = 401;
      throw error;
    }
    const subscriptions = await Subscription.find({
      user: req.params.id,
    }).populate("user", "-password");
    res.status(200).json({
      success: true,
      message: "Subscriptions fetched successfully",
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};
