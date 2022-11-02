import { Request, Response } from "express";
import { createPost } from "../services/post.service";


export async function createPostHandler(req:Request,res:Response) {
    try{
  const newPost=await createPost(req.body)
if(newPost){
   res.json(newPost) 
}else{
    res.json('cannot create a post ')
} 
    }catch(err){
res.status(500).json(err)
    }
  
}