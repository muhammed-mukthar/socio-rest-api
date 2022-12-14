import express, { Request, Response } from "express";
import {
  allPostsHandler,
  createcommentHandler,
  createPostHandler,
  deletecommentHandler,
  deletePostHandler,
  getsinglePostHandler,
  likeDislikeHandler,
  ReportPostHandler,
  timelinePostHandler,
  updatePostHandler,
  userPostHandler,
} from "../controllers/posts.controller";
import { verifyAdmin, VerifyTokenAndReissue } from "../middleware/jwtvalidate";
import validateResource from "../middleware/validateResource";
import { createPostSchema } from "../schema/post.schema";

const router = express.Router();

router.post("/",VerifyTokenAndReissue, createPostHandler); //create a post

router
  .route("/:id")
  .get(VerifyTokenAndReissue,getsinglePostHandler)//get a post
  .put(VerifyTokenAndReissue,updatePostHandler) //update a post
  .delete(VerifyTokenAndReissue,deletePostHandler); //delete a post
 
//like dislike a post
router.put("/:id/like",VerifyTokenAndReissue,likeDislikeHandler);

//get timeline posts
router.get('/timeline/all',VerifyTokenAndReissue,timelinePostHandler)

//user's post 
router.get("/profile/:id", VerifyTokenAndReissue,userPostHandler);


//create comment
router.put('/:id/comment',VerifyTokenAndReissue,createcommentHandler)

//edi comment
router.put('/:id/uncomment',VerifyTokenAndReissue,deletecommentHandler)


router.put('/:id/report',VerifyTokenAndReissue,ReportPostHandler)

//all posts
router.get("/",verifyAdmin,allPostsHandler);
export default router;
