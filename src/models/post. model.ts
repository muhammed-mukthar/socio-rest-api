import mongoose from "mongoose";
import { UserDocument } from "./user.model";

export interface PostDocument extends  mongoose.Document {
    userId: UserDocument['_id'];
    likes: string[];
    desc:string;
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
        type:String
     },
     likes:{
        type:Array,
        default:[]
     }
    },
    {
      timestamps: true,
    }
  );
  
  const PostModel = mongoose.model<PostDocument>("Post", PostSchema);
  export default PostModel
  