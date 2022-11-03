import { Request, Response } from "express";
import PostModel from "../models/post. model";

import { createPost, DeletePost, findPost, UpdatePost } from "../services/post.service";
import mongoose, { ObjectId } from "mongoose";
import { strict } from "assert";
const objectid=mongoose.Types.ObjectId

/* ------------------------------- create post ------------------------------ */

export async function createPostHandler(req: Request, res: Response) {
  try {
    const newPost = await createPost(req.body);
    if (newPost) {
      res.json(newPost);
    } else {
      res.json("cannot create a post ");
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

/* ------------------------------- update post ------------------------------ */

export async function updatePostHandler(req: Request, res: Response) {
  try {
    const post = await findPost({ _id: req.params.id });
    console.log(post?.userId,req.params.id,req.body.userId);
    
      if (post && post.userId == req.body.userId) {
        const updatedPost = await UpdatePost(
          { _id: req.params.id },
          { $set: req.body }
        );
        res.status(200).json(updatedPost);
      } else {
        res.status(403).json("you can only update yours ");
      }
  
  } catch (err) {
    res.status(403).json(err);
  }
}


/* ------------------------------- delete post ------------------------------ */

export async function deletePostHandler(req: Request, res: Response) {
    try {
        
        const post = await findPost({ _id: req.params.id })
        console.log(post);
        if(!post) return res.status(301).json('invalid post post')
        console.log(post?.userId,req.params.id,req.body.userId);
        if ( post.userId == req.body.userId) {
              DeletePost(
              req.params.id
            ).then((e)=>res.json('post deleted successfully'))
            .catch((e)=>res.json(e))
        }else{
            res.status(403).json("you can only dekete yours ");
        }
    }catch(err){
        res.json(err)
    }
  }



  //like post

  export async function likeDislikeHandler(req: Request, res: Response) {
    try{
      const post = await findPost({ _id: req.params.id })
      if(!post) return res.status(404).json('post not found')
      if(!post.likes.includes(req.body.userId)){
      await UpdatePost(
          { _id: req.params.id },
          { $push: {likes:req.body.userId}})
          res.json("The post has been liked")
      }else{
         await UpdatePost(
          { _id: req.params.id },
          { $pull: {likes:req.body.userId}})
          res.json("The post has been disliked")
      }
    }catch(err){
      res.status(500).json(err)
    } 
  }