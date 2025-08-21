import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addComment, getVideoComments , deleteComment, updateComment } from "../controllers/comment.controller.js"

const commentRouter = Router()

commentRouter.use(verifyJWT) 

commentRouter.route("/:videoId").get(getVideoComments).post(addComment);

commentRouter.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export {commentRouter}