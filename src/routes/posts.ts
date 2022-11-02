import express,{Request,Response} from 'express'
import validateResource from '../middleware/validateResource'
import { createPostSchema } from '../schema/post.schema'

const router=express.Router()
//create a post

router.route('/')
.post(validateResource(createPostSchema),)

//update a post
//delete a post
//like a post
//get a post
//get timeline posts

export default router