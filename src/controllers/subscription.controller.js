import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler (async(req,res)=>{
   const {channelId} = req.params
   // toggle subscriptions
   
})


const getUserChannelSubscribers = asyncHandler(async(req, res)=>{
   const {channelId} = req.params
   // just to return subscriber list of a channel
})

const getSubscribedChannels = asyncHandler(async(req,res)=>{
   const {subscribedId} = req.params
   // to return channels which user have subscribed to
})

export {
   toggleSubscription,
   getSubscribedChannels,
   getUserChannelSubscribers,
}
