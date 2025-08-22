import { asyncHandler } from "../utils/asyncHandler.js";


const toggleVideoLike = asyncHandler(async(req,res)=>{
   const {videoId} = req.params
   
})

const toggleCommentLike = asyncHandler(async(req,res)=>{
   const {commentId} = req.params
   // toggling the like on comment
})
const toggleTweetLike = asyncHandler(async(req,res)=>{
   const {tweetId} = req.params
   // toggling the like on tweet 
})
const getLikedVideos = asyncHandler(async(req,res)=>{
   // get all liked videos 
})

export {
   toggleCommentLike,
   toggleVideoLike,
   toggleTweetLike,
   getLikedVideos,
}