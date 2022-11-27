import express,{Request,Response} from 'express'
import { blockUserHandler, deleteUserHandler, followHandler, getAllUsersHandler, getUserHandler, unblockHandler, unfollowHandler, updateUserHandler } from '../controllers/users.controller'
import { VerifyTokenAndReissue } from '../middleware/jwtvalidate'
import UserModel from '../models/user.model'

const router=express.Router()
router.get('/suggestedusers',VerifyTokenAndReissue,getAllUsersHandler)
router.route('/:id')
.put(VerifyTokenAndReissue,updateUserHandler)//update user
.delete(VerifyTokenAndReissue,deleteUserHandler)//delete user
.get(getUserHandler)//get user


/* ------------------------------ follow a user ----------------------------- */
router.put('/:id/follow',VerifyTokenAndReissue,followHandler)
/* ----------------------------- unfollow a user ---------------------------- */
router.put('/:id/unfollow',VerifyTokenAndReissue,unfollowHandler)
//block user
router.put("/block/:id",blockUserHandler);

//unblock user
router.put("/unblock/:id",unblockHandler);

export default router