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