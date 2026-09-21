import Razorpay from "razorpay";
import Subscription from "../models/subscriptionModel.js";
const rzpInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
export const createsubscription = async (req, res, next) => {
  try {
    console.log(typeof req.user._id);
    const newSubcription = await rzpInstance.subscriptions.create({
      plan_id: req.body.planId,
      // Razorpay permits at most 40 billing cycles for this plan.
      // Charge monthly subscribers for one year.
      total_count: 12,
      notes: {
        userId: req.user._id,
      },
    });
    const subscription = new Subscription({
      razorpaySubscriptionId: newSubcription.id,
      userId: req.user._id,
    });
    await subscription.save();
    console.log(newSubcription);
    res.json({ subscriptionsId: newSubcription.id });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
