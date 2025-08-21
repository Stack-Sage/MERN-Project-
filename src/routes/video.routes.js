import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const videoRouter  = Router()

videoRouter.use(verifyJWT)

videoRouter
.route("/")
.get(getAllVideos)
.post(
   upload.fields([
      {
         name:"videoFile",
         maxcount:1,
      },
      {
         name:"thumbnail",
         maxcount:1,
      }
   ]),
    publishVideo
)

videoRouter
.route("/:videoId")
.get(getVideoById)
.delete(deleteVideo)
.patch(upload.single("thumbnail"),updateVideo)


videoRouter.route("/toggle/publish/:videoId").patch(togglePublishStatus)

export {videoRouter}