import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!(name && description)) {
    throw new ApiError(404, "Please Provide Name and description");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
    videos: [],
  });
  if (!playlist) {
    throw new ApiError(500, "Playlist wasn't created");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist Created successfully !!"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const playlist = await Playlist.find({ owner: userId });
  if (playlist.length === 0) {
    throw new ApiError(500, "This user has no playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "User Playlist Found!!"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "No Playlist found!");
  }

  return res.status(200).json(new ApiResponse(200, playlist, "Playlist Found"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "No Playlist found!");
  }
  if (!playlist.videos.includes(videoId)) {
    playlist.videos.push(videoId);
    await playlist.save();

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Video Added to the playlist!!"));
  } else {
    return res
      .status(200)
      .json(
        new ApiResponse(
          400,
          playlist,
          "Video is already Added to the playlist!!"
        )
      );
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const playlist = await Playlist.findById(playlistId);

  if (playlist.length === 0 ) {
    throw new ApiError(400, "No Playlist found!");
  }

  const previousLength  = playlist.videos.length
  playlist.videos = playlist.videos.filter((id)=> id.toString() !== videoId)


  if (playlist.videos.length === previousLength) {
   
    return res
      .status(200)
      .json(new ApiResponse(400, playlist, "Video not Found in the playlist!!"));
  } 

  await playlist.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200, playlist, "Video is deleted from the playlist!!"
        )
      );
  
});

const deletePlayList = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const playlist = await Playlist.findByIdAndDelete(playlistId);
  
  return res
  .status(200)
  .json(
   new ApiResponse(200,{},"Playlist deleted Successfully!!")
  )

  
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { newName, newDescription } = req.body;
   if(!(newName && newDescription) ){
      throw new ApiError("No update was made!")
   }

   const playlist = await Playlist.findByIdAndUpdate(playlistId,
      {
         $set:{
            name:newName,
            description:newDescription,
         }
      },
      {new:true}
   )
   if(!playlist){
      throw new ApiError(500,"Playlist wasn't updated ")
   }
   
   return res
   .status(200)
   .json(
      new ApiResponse(200,playlist,"Playlist was successfully updated!")
   )

});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlayList,
  updatePlaylist,
};
