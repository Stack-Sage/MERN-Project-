import mongoose, { model, Schema } from "mongoose";

const tweetSchema = new Schema({
   owner:{
      type: Schema.Types.ObjectId,
      ref: "Users"
   },
   content:{
      type:String,
      required:true,
   }
},{timestamps:true})

export const Tweet = model("Tweet",tweetSchema)