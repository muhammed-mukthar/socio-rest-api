import express, { Request, Response } from "express";
import {
  createPostHandler,
  deletePostHandler,
  getsinglePostHandler,
  likeDislikeHandler,
  updatePostHandler,
} from "../controllers/posts.controller";
import validateResource from "../middleware/validateResource";
import { createPostSchema } from "../schema/post.schema";

const router = express.Router();

router.post("/", validateResource(createPostSchema), createPostHandler); //create a post

router
  .route("/:id")
  .get(getsinglePostHandler)//get a post
  .put(updatePostHandler) //update a post
  .delete(deletePostHandler); //delete a post
 
//like dislike a post
router.put("/:id/like",likeDislikeHandler);

//get timeline posts

export default router;
