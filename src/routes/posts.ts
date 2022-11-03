import express, { Request, Response } from "express";
import {
  createPostHandler,
  deletePostHandler,
  likeDislikeHandler,
  updatePostHandler,
} from "../controllers/posts.controller";
import validateResource from "../middleware/validateResource";
import { createPostSchema } from "../schema/post.schema";

const router = express.Router();

router.post("/", validateResource(createPostSchema), createPostHandler); //create a post

router
  .route("/:id") //update a post
  .put(updatePostHandler)
  .delete(deletePostHandler); //delete a post
//like dislike a post
router.put("/:id/like",likeDislikeHandler);
//get a post
//get timeline posts

export default router;
