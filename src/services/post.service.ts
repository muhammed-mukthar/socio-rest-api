import { FilterQuery, UpdateQuery } from "mongoose";
import PostModel, { PostDocument, postinput } from "../models/post. model";

export async function createPost(input:postinput) {
    try{
        const post=await PostModel.create(input)
     if(post)   return post
     return false
    }catch(err){
        return false
    }
  
}

export async function findPost(query: FilterQuery<PostDocument>) {
    return PostModel.findOne(query).lean();
  }

  export async function UpdatePost(filterquery: FilterQuery<PostDocument> ,updatequery:UpdateQuery<PostDocument>) {
    try {
        console.log(filterquery,updatequery);
        
      let updatedPost = await PostModel.findByIdAndUpdate(filterquery,updatequery);
      console.log(updatedPost,'fsfsfsdf');
      
  if(updatedPost)    return updatedPost;
  return false
    } catch (err) {
      return err;
    }
  }