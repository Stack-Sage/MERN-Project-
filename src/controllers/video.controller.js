import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { helperFindVideoId } from "../utils/FindVideoById.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";




const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;
  
  let filter = {owner:userId};

  const pageNum = Number(page)
  const limitNum = Number(limit)
  
  if(query){
    filter.$or = [
      {title : {$regex:query,  $options:"i"}},
      {description: {$regex:query, $options:"i"}}
    ]
  }

  // console.log("filter is ",filter)

  const allVideos = await Video.find(filter)
  .skip((pageNum-1) * limitNum)
  .limit(limitNum)
  .sort({[sortBy]: sortType === "desc"? -1:1})

  if(!allVideos || allVideos.length === 0){
    throw new ApiError(404, "No Videos Found");
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, allVideos, "Videos fetched successfully!")
  )
  
});

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!(title && description)) {
    throw new ApiError(400, "Title or Description are missing!");
  }

  const videoFileLocalPath = req.files?.videoFile?.[0].path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0].path;

  if (!(videoFileLocalPath && thumbnailLocalPath)) {
    throw new ApiError(400, "VideoLocal File and ThumbnailLocal are required!");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  console.log("thumbnail uplaoded successfully ");

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  console.log("videoFile uplaoded successfully ");
  // console.log(thumbnail)
  // console.log(videoFile)
  if (!(videoFile && thumbnail)) {
    throw new ApiError(400, "Video File and thumbnail are required  ");
  }

  const video = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    owner: req.user._id,
    duration: videoFile.duration || 0,
  });

  const createdVideo = await Video.findById(video._id);

  if (!createdVideo) {
    throw new ApiError(500, "Video wasn't uplaoded ! Failed upload");
  }
  // console.log(createdVideo);

  return res
    .status(200)
    .json(new ApiResponse(200, createdVideo, "Video Uploaded SuccessFully !"));
});


const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await helperFindVideoId(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video is Successfully Fetched!"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await helperFindVideoId(videoId)

  const { newTitle, newDescription } = req.body;
  
  if (!(newTitle, newDescription)) {
    throw new ApiError(404, "new title and Description no recieved!");
  }

  // console.log("req file is : ",req.file)
  const thumbnailLocalPath =  req.file?.path;
  // console.log("thumbnail local path is ", thumbnailLocalPath)

  if (!thumbnailLocalPath) {
    throw new ApiError(404, "thumbnail not Received!");
  }

  const newThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!newThumbnail) {
    throw new ApiError(404, "New thumbnail was not set !");
  }
  const videoUpdated = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: newTitle,
        description: newDescription,
        thumbnail: newThumbnail.url
      },
    },
    {
      new: true,
    }
  ).select(" -isPublished -videoFile ");

  if (!video) {
    throw new ApiError(500, "video is not found ");
  }
  console.log(video);

  return res
    .status(200)
    .json(new ApiResponse(200,videoUpdated, "Video Details updated Successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await helperFindVideoId(videoId);

  await Video.deleteOne(video)
  // console.log("video deleted successfully")
  
  return res
  .status(200)
  .json(
    new ApiResponse(200,{},"Video deleted Successfully")
  )
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await helperFindVideoId(videoId);
  const newStatus = !video.isPublished;

  await video.updateOne(
    {
      $set:{ isPublished: newStatus}
    },
    {new:true}
  )

  return res 
  .status(200)
  .json(
    new ApiResponse(200,newStatus, `isPublished is set ${newStatus} `)
  )

});

export {
  getAllVideos,
  getVideoById,
  updateVideo,
  publishVideo,
  deleteVideo,
  togglePublishStatus,
};
