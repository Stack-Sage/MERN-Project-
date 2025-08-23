import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelStats, getChannelVideos,getChannelTakes } from "../controllers/dashboard.controller.js";

const dashboardRouter = Router()

dashboardRouter.use(verifyJWT)

dashboardRouter.route("/channel-stats").get(getChannelStats)

dashboardRouter.route("/channel-videos").get(getChannelVideos)
dashboardRouter.route("/channel-takes").get(getChannelTakes)

export {dashboardRouter}