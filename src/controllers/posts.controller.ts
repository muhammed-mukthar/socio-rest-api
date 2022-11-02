import { Request, Response } from "express";
import PostModel from "../models/post. model";

import { createPost, findPost, UpdatePost } from "../services/post.service";
import mongoose from "mongoose";
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
        const updateduser = await UpdatePost(
          { _id: req.params.id },
          { $set: req.body }
        );
        res.status(200).json(updateduser);
      } else {
        res.status(403).json("you can only update your choice");
      }
  
  } catch (err) {
    res.status(403).json(err);
  }
}
