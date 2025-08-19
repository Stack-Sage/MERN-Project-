import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addComment, getVideoComments , deleteComment, updateComment } from "../controllers/comment.controller.js"

const commentRouter = Router()

commentRouter.use(verifyJWT)  // this middleware now will be added to all routes in this file , so i don't have to add it everytime cause i would only want user to comment if he is login

commentRouter.route("/:videoId").get(getVideoComments).post(addComment);

commentRouter.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export {commentRouter}