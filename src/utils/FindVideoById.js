import { ApiError } from "./ApiError.js";
import { Video } from "../models/video.model.js";

async function helperFindVideoId(videoId) {
  if (videoId.trim() === "") {
    throw new ApiError(400, "Invalid Video Id");
  }
  const video = await Video.findById(videoId);
  
  if (!video) {
    throw new ApiError(400, "No video Exists");
  }
  return video;
}

export { helperFindVideoId }