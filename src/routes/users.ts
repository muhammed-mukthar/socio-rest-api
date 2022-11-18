import express,{Request,Response} from 'express'
import { deleteUserHandler, followHandler, getAllUsersHandler, getUserHandler, unfollowHandler, updateUserHandler } from '../controllers/users.controller'
import { VerifyTokenAndReissue } from '../middleware/jwtvalidate'
import UserModel from '../models/user.model'

const router=express.Router()
router.get('/suggestedusers',VerifyTokenAndReissue,getAllUsersHandler)
router.route('/:id')
.put(VerifyTokenAndReissue,updateUserHandler)//update user
.delete(VerifyTokenAndReissue,deleteUserHandler)//delete user
.get(VerifyTokenAndReissue,getUserHandler)//get user


/* ------------------------------ follow a user ----------------------------- */
router.put('/:id/follow',VerifyTokenAndReissue,followHandler)
/* ----------------------------- unfollow a user ---------------------------- */
router.put('/:id/unfollow',VerifyTokenAndReissue,unfollowHandler)
export default router