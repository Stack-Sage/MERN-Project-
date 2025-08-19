import { asyncHandler } from "../utils/asyncHandler.js";


const createPlaylist = asyncHandler(async(req,res)=>{
   const {name,description} = req.body 
   // create playlist
})

const getUserPlaylists = asyncHandler(async (req,res)=>{
   const {userId} = req.params 
   // get user playlists
})

const getPlaylistById = asyncHandler(async(req,res)=>{
   const {playlistId} = req.params
   // get playlist by id 
})

const addVideoToPlaylist = asyncHandler(async(req,res)=>{
   const {playlistId,videoId} = req.params
})

const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{
   const {playlistId,videoId} = req.params 
   // remove video from play list 
})

const deletePlayList = asyncHandler(async(req,res)=>{
   const {playlistId} = req.params
   // delete playlist
})

const updatePlaylist = asyncHandler(async(req,res)=>{
   const {playlistId} = req.params
   const {name,description} =req.body
})

export {
   createPlaylist,
   getUserPlaylists,
   getPlaylistById,
   addVideoToPlaylist,
   removeVideoFromPlaylist,
   deletePlayList,
   updatePlaylist
}