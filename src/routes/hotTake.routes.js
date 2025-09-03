import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { updateTakes, createTakes, getUserTakes, deleteTakes, rateCapTake, rateMidTake, rateFactsTake,getAllTakes } from "../controllers/hotTake.controller.js";

const hotTakeRouter = Router()

hotTakeRouter.use(verifyJWT)


hotTakeRouter.route("/").post(createTakes);

hotTakeRouter.post("/rate/cap/:takeId", rateCapTake);
hotTakeRouter.post("/rate/mid/:takeId", rateMidTake);
hotTakeRouter.post("/rate/facts/:takeId", rateFactsTake);

hotTakeRouter.route("/user/:userId").get(getUserTakes)
hotTakeRouter.route("/all").get(getAllTakes)
hotTakeRouter.route("/:takeId").patch(updateTakes).delete(deleteTakes)

export { hotTakeRouter }