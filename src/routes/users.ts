import express,{Request,Response} from 'express'
import { blockUserHandler, deleteUserHandler, filterHandler, followHandler, getAllUsersHandler, getFriendsHandler, getUserHandler, unblockHandler, unfollowHandler, updateUserHandler } from '../controllers/users.controller'
import { verifyAdmin, verifyTokenAndAuthorization, VerifyTokenAndReissue } from '../middleware/jwtvalidate'
import UserModel from '../models/user.model'

const router=express.Router()
router.get('/suggestedusers',VerifyTokenAndReissue,getAllUsersHandler)
router.route('/:id')
.put(VerifyTokenAndReissue,updateUserHandler)//update user
.delete(VerifyTokenAndReissue,deleteUserHandler)//delete user
.get(VerifyTokenAndReissue,getUserHandler)//get user


/* ------------------------------ follow a user ----------------------------- */
//@ts-ignore
router.put('/:id/follow',VerifyTokenAndReissue,followHandler)
/* ----------------------------- unfollow a user ---------------------------- */
router.put('/:id/unfollow',VerifyTokenAndReissue,unfollowHandler)
//block user
router.put("/block/:id",verifyAdmin,blockUserHandler);

//unblock user
router.put("/unblock/:id",verifyAdmin,unblockHandler);

//filter User
router.post('/filteruser',verifyTokenAndAuthorization,filterHandler)

//get friends
router.get("/friends/:userId",VerifyTokenAndReissue, getFriendsHandler);

export default router