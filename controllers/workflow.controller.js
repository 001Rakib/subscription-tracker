import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from "../models/subscriptions.models.js";
import dayjs from "dayjs";

const REMINDERS = [7, 5, 2, 1];

export const sendReminder = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Subscription for this id ${subscriptionId} is already expired. stopping workflow`
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    const remainderDate = renewalDate.subtract(daysBefore, "day");

    if (remainderDate.isAfter(dayjs())) {
      await sleepUntillRemainder(
        context,
        `Remainder ${daysBefore} days before`,
        remainderDate
      );
    }
    await triggerRemainder(context, `Remainder ${daysBefore} days before`);
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("getSubscription", async () => {
    return await Subscription.findById(subscriptionId).populate(
      "user",
      "name email"
    );
  });
};

const sleepUntillRemainder = async (context, label, date) => {
  console.log(`Sleeping until ${label} remainder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};
const triggerRemainder = async (context, label) => {
  return await context.run(label, () => {
    console.log(`Triggering ${label} remainder`);

    // Here you would send the email or notification to the user
  });
};
