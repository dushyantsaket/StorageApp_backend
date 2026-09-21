import express from "express";
import { createsubscription } from "../controllers/subscriptionController.js";
import checkAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", checkAuth, createsubscription);

export const subscriptionRoutes = router;
