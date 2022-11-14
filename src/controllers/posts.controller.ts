import e, { Request, Response } from "express";
import PostModel from "../models/post. model";

import { createPost, DeletePost, findallPost, findPost, UpdatePost } from "../services/post.service";
import mongoose, { ObjectId } from "mongoose";
import { strict } from "assert";
import { findUser } from "../services/user.service";
import { string } from "zod";
import { rmSync } from "fs";
const objectid=mongoose.Types.ObjectId

/* ------------------------------- create post ------------------------------ */

export async function createPostHandler(req: Request, res: Response) {
  try {
    
    
    //@ts-ignore
    const userId=req.user.id
    const postbody={
      ...req.body,
      userId:userId
    }
    console.log(postbody,'postbody');
    
    const newPost = await createPost(postbody);
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
    
    
      if (post && post.userId == req.body.userId) {
        const updatedPost = await UpdatePost(
          { _id: req.params.id },
          { $set: req.body }
        );
        res.status(200).json('post has been updated');
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
        
        if(!post) return res.status(301).json('invalid post post')
    
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
      //@ts-ignore
      console.log(req.user.id,'hallo i am here');
      
      const post = await findPost({ _id: req.params.id }) 
      console.log(post,'fsfsd');
      
      if(!post) return res.status(404).json('post not found')
      
      //@ts-ignore
      if(!post.likes.includes(req.user.id)){
      await UpdatePost(
          { _id: req.params.id },
           //@ts-ignore
          { $push: {likes:req.user.id}})
          // console.log(post.likes.includes(req.body.userId),'sfsff');
          
          res.json("The post has been liked")
      }else{
         await UpdatePost(
          { _id: req.params.id },
          //@ts-ignore
          { $pull: {likes:req.user.id}})
          res.json("The post has been disliked")
      }
    }catch(err){
      res.status(500).json(err)
    } 
  }


  //get post

  export async function getsinglePostHandler(req: Request, res: Response) {
    try{
      const post = await findPost({ _id: req.params.id })
      res.status(200).json(post)
    }catch(err){
      res.status(500).json(err)
    }
  }

  export async function userPostHandler(req: Request, res: Response) {
    try {
      // const user = await User.findOne({ username: req.params.username });
     
      
      const posts = await findallPost({ userId: req.params.id });
     
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  //get timeline post

  export async function timelinePostHandler(req: Request, res: Response) {
    try{
      let user:mongoose.Types.ObjectId
      //@ts-ignore
      user=new objectid(req.user.id) 
    const currentUser = await findUser({_id:user});
    if(!currentUser ||currentUser ==null) return res.json('user not found')
    const userPosts = await findallPost({userId:currentUser._id})
    if(!userPosts) return  res.json('you have not posted')
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return  findallPost({userId:friendId});
      })
    )
    
    
    //@ts-ignore
    res.json(userPosts.concat(...friendPosts))
  } catch (err) {
    res.status(500).json(err);
  }
}


export async function createcommentHandler(req: Request, res: Response) {
  try{
    const {comment} = req.body;
            const comments={
              //@ts-ignore
                  user:req.user.id,
                    //@ts-ignore
                  name:req.user.name,
                 
                  comment,
                   //@ts-ignore
                  profile:req.user.profilePic
            }
  const post=await findPost({_id:req.params.id})
  if(post){
   
    console.log(comments,'comments');
    
    await UpdatePost(
      { _id: req.params.id },
      //@ts-ignore
      { $push: {comments:comments}})

      res.json('comment created successfully')
  }else{
    res.json(401).json('post not found')
  }
  
  }catch(err){
    res.status(500).json(err)
  }
  
}

export async function deletecommentHandler(req: Request, res: Response){
  try{
    await UpdatePost(
      { _id: req.params.id },
      //@ts-ignore
      { $pull: { comments: {_id:req.query.comment}}})
      res.json('comment deleted successfully')
  }catch(err){
    res.status(500).json(err)
  }
}