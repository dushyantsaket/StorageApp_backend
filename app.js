<<<<<<< Updated upstream
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
await connectDB();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cookieParser(process.env.SESSION_SECRET));
// Razorpay's signature is calculated from the exact request bytes, so this
// route must receive the raw body before express.json() parses it.
app.use("/webhooks", express.raw({ type: "application/json" }), webhookRoutes);
app.use(express.json());
const whitelist = [process.env.CLIENT_URL_1, process.env.CLIENT_URL_2];
app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.get("/", (req, res) => {
  res.json({ message: "hello from StorageApp" });
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
=======
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
await connectDB();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cookieParser(process.env.SESSION_SECRET));
// Razorpay's signature is calculated from the exact request bytes, so this
// route must receive the raw body before express.json() parses it.
app.use("/webhooks", express.raw({ type: "application/json" }), webhookRoutes);
app.use(express.json());
const whitelist = [process.env.CLIENT_URL_1, process.env.CLIENT_URL_2];

app.use((req ,res, next) => {
 console.log(req.headers)
next()
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
app.get("/", (req, res) => {
  res.json({ message: "hello from StorageApp" });
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
>>>>>>> Stashed changes
