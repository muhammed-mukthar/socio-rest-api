import express,{Request,Response} from 'express'
import { deleteUserHandler, followHandler, getUserHandler, updateUserHandler } from '../controllers/users.controller'
import UserModel from '../models/user.model'

const router=express.Router()




router.route('/:id')

.put(updateUserHandler)//update user

.delete(deleteUserHandler)//delete user

.get(getUserHandler)//get user
/* ------------------------------ follow a user ----------------------------- */
router.put('/:id/follow',followHandler)
/* ----------------------------- unfollow a user ---------------------------- */

export default router