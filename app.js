app.js;
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import { subscriptionRoutes } from "./routes/subscriptionRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import checkAuth from "./middlewares/authMiddleware.js";
import { connectDB } from "./config/db.js";
import { spawn } from "child_process";
import crypto from "node:crypto";
await connectDB();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cookieParser(process.env.SESSION_SECRET));
// Razorpay's signature is calculated from the exact request bytes, so this
// route must receive the raw body before express.json() parses it.
app.use("/webhooks", express.raw({ type: "application/json" }), webhookRoutes);
//app.use(express.json());
const whitelist = [process.env.CLIENT_URL_1, process.env.CLIENT_URL_2];

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      console.log(origin);
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

//app.post("/github-webhook", (req, res) => {
//  const givenSignature = req.headers["x-hub-signature-256"];

app.post(
  "/github-webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    console.log(req.headers);
    const givenSignature = req.headers["x-hub-signature-256"];

    console.log(givenSignature);

    if (!givenSignature) {
      return res.status(403).json({ error: "Invalid Signature" });
    }

    const calculatedSignature =
      "sha256=" +
      crypto
        .createHmac("sha256", process.env.GITHUB_SECRET)
        .update(req.body)
        // .update(JSON.stringify(payload))
        .digest("hex");
    // crypto.timingSafeEqual;

    console.log(calculatedSignature);

    if (givenSignature !== calculatedSignature) {
      return res.status(403).json({ error: "Invalid Signature" });
    }

    const payload = JSON.parse(req.body.toString());
    console.log("🔥 REPOSITORY:", payload.repository?.full_name);
    console.log("🔥 BRANCH:", payload.ref);

    console.log(calculatedSignature);

    console.log("");
    console.log("REQUEST HEADERS:", req.headers);
    console.log("REQUEST BODY:", req.body);
    res.json({ message: "OK" });
    let repository;

    if (req.body.repository.name === "storageApp-fronted") {
      repository = "fronted";
    } else {
      repository = "backend";
    }
    console.log({ repository });
    const bashChildProcess = spawn("bash", [
      `/home/ubuntu/depolye-${repository}.sh`,
    ]);
    // const bashChildProcess = spawn("bash", ["/home/ubuntu/depolye-fronted.sh"]);

    console.log("🔥 deploye-fronted.sh spawned");
    // bashChildProcess.stdout.pipe(process.stdout);
    // bashChildProcess.stdout.pipe(process.stdout);

    bashChildProcess.stdout.on("data", (data) => {
      // console.log("got stander out data ");
      process.stdout.write(data);
    });

    bashChildProcess.stderr.on("data", (data) => {
      process.stderr.write(data);
    });

    bashChildProcess.on("close", (code) => {
      if (code === 0) {
        console.log("script executed  successfully");
      } else {
        console.log("script faild");
      }
    });
    bashChildProcess.on("error", (err) => {
      console.log("ERROR is  spawning the  process");
      console.log(err);
    });
    // console.log(bashChildProcess.stdout);
    // console.log(bashChildProcess.stderr);
  },
);

app.get("/", (req, res) => {
  res.json({ message: "hello from My StorageApp" });
});

app.get("/err", (req, res) => {
  console.log("process exited with error");
  process.exit(1);
});

app.use("/directory", checkAuth, directoryRoutes);
app.use("/file", checkAuth, fileRoutes);
app.use("/", userRoutes);
app.use("/auth", authRoutes);
app.use("/subscription", subscriptionRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server Started`);
});
