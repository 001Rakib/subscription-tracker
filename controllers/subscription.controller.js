import Subscription from "../models/subscriptions.models.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: subscription,
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
