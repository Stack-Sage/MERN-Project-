import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import validator from 'validator'
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'

const registerUser = asyncHandler( async (req , res)=>{
   
   console.log("req files ",req.files)
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

   const avatarLocalPath = req.files?.avatar?.[0]?.path;
   const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
   console.log(avatarLocalPath)
   if(!avatarLocalPath){
      throw new ApiError(400,"AvatarLocal file is Required!")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
      throw new ApiError(400,"Avatar 1 file is Required!")
   }

   const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
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
   console.log(createdUser)
   return res.status(201).json(
      new ApiResponse(200,createdUser,"User Registered Successfully!")
   )


} )


export {registerUser}
