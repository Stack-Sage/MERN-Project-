import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import validator from 'vali'
import {User} from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'

const registerUser = asyncHandler( async (req , res)=>{
  
   const  {fullName,username,email,password } = req.body
   
   if(
      [fullName,email,username,password].some((field)=>{
         return field?.trim()===""
      })  
   ){
      throw new ApiError(400,"All Fields are Required")
   }  

   if(!validator.isEmail(email)){
      throw new ApiError(400,"Invalid email format!")
   }
   
   const existedUser = await User.findOne({
      $or:[{email},{username}]
   })

   if(existedUser){
      if(existedUser.email === email){
         throw new ApiError(409,"Email Already Exists !")
      }
      if(existedUser.username === username){
         throw new ApiError(409,"Username is not availble !")
      }
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
      throw new ApiError(400,"Avatar file is Required!")
   }

   const cloudAvatar = await uploadOnCloudinary(avatarLocalPath)
   const cloudCoverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!cloudAvatar){
      throw new ApiError(400,"Avatar file is Required!")
   }

   const user = await User.create({
      fullName,
      avatar: cloudAvatar.url,
      coverImage: cloudCoverImage?.url || "",
      username: username.toLowerCase(),
      email,
      password,

   })

   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   if(!createdUser){
      throw new ApiError(500,"User Wasn't Registered Successfully! Don't worry it's our fault ")
   }

   return res.status(201).json(
      new ApiResponse(200,createdUser,"User Registered Successfully!")
   )


} )


export {registerUser}
