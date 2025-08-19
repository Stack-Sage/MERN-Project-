import { asyncHandler } from "../utils/asyncHandler.js";


const getChannelStats = asyncHandler(async(req,res)=>{
   // geting the chaneel stats like total videos views , total subs , videos , likes , dislikes , tweets if any all that etc 
})

const getChannelVideos = asyncHandler(async(req,res)=>{
   // get all the videos which have been uploaded by the channel
})

export{
   getChannelStats,
   getChannelVideos,
}