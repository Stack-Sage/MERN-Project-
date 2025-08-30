import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVideosOfUser, getVideoById, publishVideo, showAllVideos, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const videoRouter  = Router()

videoRouter.use(verifyJWT)

videoRouter
.route("/")
.get(getAllVideosOfUser)
.post(
   upload.fields([
      {
         name:"videoFile",
         maxCount:1,
      },
      {
         name:"thumbnail",
         maxCount:1,
      }
   ]),
    publishVideo
)
videoRouter.route("/all").get(showAllVideos)

videoRouter
.route("/:videoId")
.get(getVideoById)
.delete(deleteVideo)
.patch(upload.single("updatedThumbnail"),updateVideo)


videoRouter.route("/toggle/publish/:videoId").patch(togglePublishStatus)

export {videoRouter}