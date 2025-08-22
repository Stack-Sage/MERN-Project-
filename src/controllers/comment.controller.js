import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);

  const allComments = await Comment.find({ video: videoId })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  console.log(allComments);
  if (!allComments) {
    throw new ApiError("Can't fetch comments");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, allComments, "All comments Fetched Successfully!")
    );
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;
  console.log(content);
  if (content.trim() === "") {
    throw new ApiError(404, "No comment was Provided");
  }

  if (videoId.trim() === "") {
    throw new ApiError(404, "No VideoId was Provided");
  }

  const addComment = await Comment.create({
    content,
    owner: req.user._id,
    video: videoId,
  });

  if (!addComment) {
    throw new ApiError("Comment was not added!");
  }
  console.log(addComment);

  return res
    .status(200)
    .json(new ApiResponse(200, addComment, "Comment Added Successfully!"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { newComment } = req.body;
  if (newComment.trim() === "") {
    throw new ApiError("Please provide a comment to update");
  }
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: newComment,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedComment) {
    throw new ApiError("Comment wasn't updated ");
  }
  return res
  .status(200)
  .json(
   new ApiResponse(200,updatedComment,"Comment updated successfully!!")
  )
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment Deleted Successfully! "));
});

export { getVideoComments, addComment, deleteComment, updateComment };
