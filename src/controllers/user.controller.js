import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import validator from "validator";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Tokens can't be generated!");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // console.log("req files ", req.files);
  const { fullName, username, email, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All Fields are Required");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email format!");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    if (existedUser.email === email) {
      throw new ApiError(409, "Email Already Exists !");
    }
    if (existedUser.username === username) {
      throw new ApiError(409, "Username is not availble !");
    }
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  // console.log(avatarLocalPath);
  if (!avatarLocalPath) {
    throw new ApiError(400, "AvatarLocal file is Required!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar cloud file is Required!");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "User Wasn't Registered Successfully! Don't worry it's our fault "
    );
  }
  // console.log(createdUser);
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully!"));
});

const loginUser = asyncHandler(async (req, res) => {
  // console.log("req.body is : ", req.body);
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "All Fields are Required! ");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(404, "Password is Incorrect!");
  }

  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User Logged out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unautharized Request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    console.log(decodedToken);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is either Expired or used");
    }

    const { newAccessToken, newRefreshToken } =
      await generateAccessRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { newAccessToken, newRefreshToken },
          "Access Token Refreshed Successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
 
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Empty Fields");
  }

  const user = await User.findById(req.user?._id);

  const isPasswordRight = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordRight) {
    throw new ApiError(400, "Invalid Password");
  }

  user.password = newPassword;

  await user.save({
    validateBeforeSave: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) =>
  {
  return res
    .status(200)
    .json(200, req.user, "current user Fetched successfully");
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName && !email) {
    throw new ApiError(400, "Atleast one field is Required");
  }
  const updateFields = {};
  if(fullName){
    updateFields.fullName = fullName
  }
  if(email){
    updateFields.email = email;
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: updateFields,
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Detials Updated Successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocal = req.file?.path;

  if (!avatarLocal) {
    throw new ApiError(400, "Avatar file is missing");
  }

  // Todo Delete Old Image
  const avatar = await uploadOnCloudinary(avatarLocal);

  if (!avatar.url) {
    throw new ApiError(500, "Error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Image Update successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocal = req.file?.path;

  if (!coverImageLocal) {
    throw new ApiError(400, "cover image file is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocal);

  if (!coverImage.url) {
    throw new ApiError(500, "Error while uploading cover image");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { coverImage: coverImage.url } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image Update successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubcribedToCount: {
          $size: "$subscribedTo",
        },
        isSubcribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubcribedToCount: 1,
        isSubcribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if(!channel?.length){
    throw new ApiError(404,"Channel does not exists")
  }
  console.log("Channel value is :", channel)

  return res.status(200)
  .json(
    new ApiResponse(200,channel[0],"User Channel feteched successfuly ")
  )
});

const getWatchHistory = asyncHandler(async(req,res)=>{


  const user = await User.aggregate([
    {
      $match:{
        _id: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup:{
        from: "videos",
        localField:"watchHistory",
        foreignField:"_id",
        as: "watchHistory",
        pipeline:[
          {
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as: "owner",
              pipeline:[
                {
                  $project:{
                    fullname:1,
                    username:1,
                    avatar:1,
                  }
                },
                {
                  $addFields:{
                    owner:{
                      $first:"$owner"
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ])
  return res
    .status(200)
    .json(
      new ApiResponse(200,user[0].watchHistory,
        "Watch history fetched successfully"
      )
    )
})




export {
  registerUser,
  loginUser, 
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
