import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { Video } from "../models/video.model.js";




const getAllVideos = asyncHandler(async(req,res)=>{
   const {page = 1,limit = 10,query,sortBy,sortType,userId} = req.querry
   // get  all the videos based on query , sort , pagination
})

const publishVideo = asyncHandler(async(req,res)=>{
   const {title,description} = req.body
   
   if(!(title && description)){
      throw new ApiError(400,"Title or Description are missing!")
   }

   const videoFileLocalPath = req.files?.videoFile?.[0].path;
   const thumbnailLocalPath = req.files?.thumbnail?.[0].path;

   if(!(videoFileLocalPath && thumbnailLocalPath)){
      throw new ApiError(400,"VideoLocal File and ThumbnailLocal are required!")
   }

   const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
   console.log("thumbnail uplaoded successfully ");
   
   const videoFile = await uploadOnCloudinary(videoFileLocalPath)
   console.log("videoFile uplaoded successfully ");
   // console.log(thumbnail)
   // console.log(videoFile)
   if(!(videoFile && thumbnail)){
      throw new ApiError(400,"Video File and thumbnail are required  ")
   }

   const video = await Video.create({
      title,
      description,
      videoFile: videoFile.url,
      thumbnail:thumbnail.url,
      owner: req.user._id,
      duration: videoFile.duration || 0, 
   })

   const createdVideo = await Video.findById(video._id)
   
   if(!createdVideo){
      throw new ApiError(
         500,"Video wasn't uplaoded ! Failed upload"
      )
   }
   console.log(createdVideo);

   return res
   .status(200)
   .json(
      new ApiResponse(200,createdVideo,"Video Uploaded SuccessFully !")
   )

})

async function helperFindVideoId(videoId) {
   if(videoId.trim() === ""){
      throw new ApiError(400,"Invalid Video Id");
   }
   const video = await Video.findById(videoId)
   if(!video){
      throw new ApiError(400,"No video Exists")
   }
   return video;
}


const getVideoById = asyncHandler(async(req,res)=>{
   const {videoId} = req.params
   const video = await helperFindVideoId(videoId) 

   return res 
   .status(200)
   .json(
      new ApiResponse(200,video,"Video is Successfully Fetched!")
   )
})

const updateVideo = asyncHandler(async(req,res)=>{
   const {videoId} = req.params
   
   const {newTitle,newDescription} = req.body
   if(!(newTitle,newDescription)){
      throw new ApiError(404,"new title and Description no recieved!")
   }
   const newThumbnail = req.file?.thumbnail?.[0].path;
   if(!newThumbnail){
      throw new ApiError(404,"thumbnail Received!")
   }
   const updatedThumbnail = await uploadOnCloudinary(newThumbnail);

   if(!updatedThumbnail){
      throw new ApiError(404,"thumbnail was not updated!")
   }
   const video = await Video.findByIdAndUpdate(videoId)
   if(!video){
      throw new ApiError(500,"video is not found ")
   }
   console.log(video)

   
   
})

const deleteVideo = asyncHandler(async(req,res)=>{
   const {videoId} = req.params
  
})

const togglePublishStatus = asyncHandler(async(req,res)=>{
   const {videoId} = req.params
   
   
})

export {
   getAllVideos,
   getVideoById,
   updateVideo,
   publishVideo,
   deleteVideo,
   togglePublishStatus,
}