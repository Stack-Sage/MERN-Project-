import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const toggleLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  let updatedVideo;

  if (!toggleLike) {
    await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
    updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { likesCount: 1 } },
      { new: true }
    );
    if (!updatedVideo) {
      throw new ApiError(500, "can't like the video");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "Video Liked Successfully!!"));
  }

  await Like.findOneAndDelete({
    video: videoId,
    likedBy: req.user._id,
  });

  updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { likesCount: -1 } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200,  updatedVideo, "Like Removed Successfully!"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const findLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  let updatedComment;

  if (!findLike) {
    await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
    updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { likesCount: 1 } },
      { new: true }
    );
    if (!updatedComment) {
      throw new ApiError(500, "can't like the comment");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, updatedComment, "Comment Liked Successfully!!"));
  }

  await Like.findOneAndDelete({
    comment: commentId,
    likedBy: req.user._id,
  });

  updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { $inc: { likesCount: -1 } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Like Removed Successfully!"));
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
