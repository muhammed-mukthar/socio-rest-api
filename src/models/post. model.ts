import mongoose from "mongoose";
import { UserDocument } from "./user.model";

export interface postinput extends mongoose.Document{
    userId: UserDocument['_id'];
    desc:string;
    img?:string
   
}

export interface PostDocument extends postinput,  mongoose.Document {
    likes: string[];
    comments:[];
    img:string,
    updatedAt: Date;
    createdAt: Date;
  }
const PostSchema = new mongoose.Schema(
    {
     userId:{
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required:true
     },
     desc:{
        type:String,
        max:500
     },
     img:{
        type:String,
       
     },
     key:{
      type:String,
      
   },
     likes:{
        type:Array,
       
     },
     comments:[
      {
                user:{
                          type:mongoose.Schema.Types.ObjectId,
                          ref: "User",
                          required:true
                },
                name:{
                          type:String,
                          required:true
                },
                profile:{
                          type:String
                },
                comment:{
                          type:String,
                          required:true
                }
      }
],
    },
    {
      timestamps: true,
    }
  );
  
  const PostModel = mongoose.model<PostDocument>("Post", PostSchema);
  export default PostModel
  