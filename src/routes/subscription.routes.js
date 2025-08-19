import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.use(verifyJWT)

subscriptionRouter.route("/c/:channelId").get(getSubscribedChannels).post(toggleSubscription)

subscriptionRouter.route("/u/:subscriberId").get(getUserChannelSubscribers)


export { subscriptionRouter}