import Razorpay from "razorpay";
import { subscriptionRoutes } from "../routes/subscriptionRoutes.js";
import User from "../models/userModel.js";
export const PLANS = {
  plan_TaT0CHvlh4iqPY: {
    code: "2Tb",
    storageQUotaBytes: 2 * 1024 ** 3,
  },
  plan_TaT0tiA8uNCmVY: {
    code: "5TB",
    storageQUotaBytes: 5 * 1024 ** 4,
  },
  plan_TaT1S75W2x86fv: {
    code: "10 Tb ",
    storageQUotaBytes: 10 * 1024 ** 4,
  },
  plan_TaT2FZhytbMq9R: {
    code: "2 TB  yearly",
    storageQUotaBytes: 2 * 1024 ** 3,
  },
  plan_TaT2qHGbEX18Ox: {
    code: "5TB  yearly",
    storageQUotaBytes: 5 * 1024 ** 4,
  },
  plan_TaT4LNqLjNP9ln: {
    code: "10 TB yearly ",
    storageQUotaBytes: 5 * 1024 ** 4,
  },
};

export const handleRazorpayWebhook = async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const isSignatureVaild = Razorpay.validateWebhookSignature(
    JSON.stringify(req.body),
    signature,
    process.env.Razorpay_WEBHOOK_SECRET,
  );
  if (isSignatureVaild) {
    console.log("signatureId  is verifed");
    console.log(req.body);
    console.log(req.body.payload.subscription.entity);

    if (req.body.event === "subscription.activted") {
      const rzpSubscription = req.bosy.payload.subscription.entity;
      const planId = rzpSubscription.plan_Id;
      const subscription = Subscription.findOne({
        razorpaySubscriptionId: rzpSubscription.id,
      });
      subscription.status = rzpSubscription.status;
      await subscription.save();
      const storageQUotaBytes = PLANS[planId].storageQUotaBytes;
      const user = await User.findById(subscription.userId);
      user.maxStorageInBytes = storageQUotaBytes;
      await user.save();
      console.log("subscription.activted");
    }
  } else {
    console.log("Signature is Not Verified ");
  }
  console.log(req.body);
  console.log(req.body.payload);
  res.end("ok");
};

// import Razorpay from "razorpay";
// import Subscription from "../models/subscriptionModel.js";
// import User from "../models/userModel.js";

// const TB = 1024 ** 4;

// export const PLANS = {
//   plan_TaT0CHvlh4iqPY: { code: "2 TB", storageQuotaBytes: 2 * TB },
//   plan_TaT0tiA8uNCmVY: { code: "5 TB", storageQuotaBytes: 5 * TB },
//   plan_TaT1S75W2x86fv: { code: "10 TB", storageQuotaBytes: 10 * TB },
//   plan_TaT2FZhytbMq9R: { code: "2 TB (yearly)", storageQuotaBytes: 2 * TB },
//   plan_TaT2qHGbEX18Ox: { code: "5 TB (yearly)", storageQuotaBytes: 5 * TB },
//   plan_TaT4LNqLjNP9ln: { code: "10 TB (yearly)", storageQuotaBytes: 10 * TB },
// };

// export const handleRazorpayWebhook = async (req, res, next) => {
//   try {
//     const signature = req.headers["x-razorpay-signature"];
//     const rawBody = Buffer.isBuffer(req.body)
//       ? req.body.toString("utf8")
//       : JSON.stringify(req.body);

//     const isSignatureValid = Razorpay.validateWebhookSignature(
//       rawBody,
//       signature,
//       process.env.Razorpay_WEBHOOK_SECRET,
//     );

//     if (!isSignatureValid) {
//       return res.status(400).json({ error: "Invalid webhook signature" });
//     }

//     const payload = JSON.parse(rawBody);

//     // The quota must only change after Razorpay confirms activation.
//     if (payload.event !== "subscription.activated") {
//       return res.status(200).json({ received: true });
//     }

//     const razorpaySubscription = payload.payload?.subscription?.entity;
//     const plan = PLANS[razorpaySubscription?.plan_id];

//     if (!razorpaySubscription || !plan) {
//       return res.status(422).json({ error: "Unknown subscription plan" });
//     }

//     const subscription = await Subscription.findOne({
//       razorpaySubscriptionId: razorpaySubscription.id,
//     });

//     if (!subscription) {
//       return res.status(404).json({ error: "Subscription not found" });
//     }

//     subscription.status = razorpaySubscription.status;
//     await subscription.save();

//     await User.findByIdAndUpdate(subscription.userId, {
//       maxStorageInBytes: plan.storageQuotaBytes,
//       storagePlan: plan.code,
//     });

//     console.log(
//       `Activated ${plan.code} storage for subscription ${razorpaySubscription.id}`,
//     );
//     return res.status(200).json({ received: true });
//   } catch (error) {
//     // Return an error so Razorpay can retry this webhook instead of losing it.
//     return next(error);
//   }
// };
