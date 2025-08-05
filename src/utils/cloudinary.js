import { v2 as cloud} from "cloudinary";
import fs from 'fs'

cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.CLOUD_API_KEY,
   api_secret: process.env.CLOUD_API_SECRET
})

async function uploadOnCloudinary(localFilePath){
   try {
      if(!localFilePath){
         return null
      }
      const response = await cloud.uploader.upload(localFilePath,{
         resource_type:"auto",
      })
      console.log("File is Uploaded on Cloudinary",response.url);
      return response
      
   } catch (error) {
      fs.unlinkSync(localFilePath)
      return null;
   }
}

export {uploadOnCloudinary}

