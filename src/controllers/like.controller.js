import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const toggleLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });
  if (!toggleLike) {
    const likeVideo = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
    if (!likeVideo) {
      throw new ApiError(500, "can't like the video");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, likeVideo, "Video Liked Successfully!!"));
  }
  await Like.findOneAndDelete({
    video: videoId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Like Removed Successfully!"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const findLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });
  if (!findLike) {
    const like = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
    if (!like) {
      throw new ApiError(500, "can't like the comment");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, like, "comment Liked Successfully!!"));
  }
  await Like.findOneAndDelete({
    comment: commentId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Like Removed Successfully!"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.find({
    likedBy: req.user._id,
    video: { $exists: true },
  }).populate("video");

  if (!likedVideos) {
    throw new ApiError(500, "Can't find User's Liked Video ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "All Liked Videos of the User!!"));
});

export { toggleCommentLike, toggleVideoLike, getLikedVideos };
