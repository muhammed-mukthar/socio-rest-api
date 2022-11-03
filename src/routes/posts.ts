import express,{Request,Response} from 'express'
import { createPostHandler, deletePostHandler, updatePostHandler } from '../controllers/posts.controller'
import validateResource from '../middleware/validateResource'
import { createPostSchema } from '../schema/post.schema'

const router=express.Router()
//create a post

router.post('/',validateResource(createPostSchema),createPostHandler)

//update a post

router.route('/:id')
.put(updatePostHandler)
//delete a post
.delete(deletePostHandler)
//like a post
//get a post
//get timeline posts

export default router