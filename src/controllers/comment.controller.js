import { asyncHandler } from "../utils/asyncHandler.js";


const getVideoComments = asyncHandler(async(req,res)=>{
   // get all comments for a video 
   const {videoId} = req.params;
   const {page = 1 ,limit = 10} = req.querry
})

const addComment = asyncHandler(async(req,res)=>{
   // adding a comment to a video
})

const updateComment = asyncHandler(async(req,res)=>{
   // updating the comment 
})

const deleteComment = asyncHandler(async(req, res)=>{
   // deleting a comment
})

export {
   getVideoComments,
   addComment,
   deleteComment,
   updateComment,
}