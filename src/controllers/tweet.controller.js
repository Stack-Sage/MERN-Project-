import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"


const createTweet = asyncHandler(async(req,res)=>{
   const {content} = req.body 
   if(content.trim() === ""){
      throw new ApiError(404,"No Tweet content was provided!!")
   }
   const tweet = await Tweet.create(
      {
         content,
         owner:req.user._id
      }
   )
   if(!tweet){
      throw new ApiError(500,"Tweet wasn't created!")
   }

   return res
   .status(200)
   .json( 
      new ApiResponse(200,tweet,"Tweet was created Successfully ")
   )
})

const getUserTweets = asyncHandler(async(req,res)=>{
   const {userId} = req.params 
   const userTweets = await Tweet.find({owner:userId})
   if(!userTweets){
      throw new ApiError(500,"No tweet found for this user! ")
   }
   return res
   .status(200)
   .json(
      new ApiResponse(200,userTweets,"Tweets were fetched Successfully")
   )
})

const updateTweet = asyncHandler(async(req,res)=>{
   const {tweetId} = req.params
   const {newContent} = req.body 
     if(!newContent){
      throw new ApiError(500,"No updated Tweet was provided")
   }
   const userTweet = await Tweet.findByIdAndUpdate(
      tweetId,
   {
      $set:{
         content:newContent
      }
   },
   {new:true}
)
   if(!userTweet){
      throw new ApiError(500,"No tweet was found ")
   }
   return res
   .status(200)
   .json(
      new ApiResponse(200,userTweet,"Tweet Updated Successfully ")
   )
})
const deleteTweet = asyncHandler(async(req,res)=>{
   const {tweetId} = req.params
   await Tweet.findByIdAndDelete(tweetId)

   return res
   .status(200)
   .json(
      new ApiResponse(200,{},"Tweet deleted Successfully ")
   )
})

export {
   createTweet,
   updateTweet,
   deleteTweet,
   getUserTweets,

}