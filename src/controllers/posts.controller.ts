import { Request, Response } from "express";
import { createPost } from "../services/post.service";


export async function createPostHandler(req:Request,res:Response) {
    try{
  const newPost=await createPost(req.body)
    }catch(err){

    }
  
}