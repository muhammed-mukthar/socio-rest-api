import express,{Request,Response} from 'express'
import { deleteUserHandler, getUserHandler, updateUserHandler } from '../controllers/users.controller'
import UserModel from '../models/user.model'

const router=express.Router()


/* ------------------------------- update user ------------------------------ */

router.put('/:id',updateUserHandler)
/* ------------------------------- delete user ------------------------------ */


router.delete('/:id',deleteUserHandler)
/* ------------------------------- get a user ------------------------------- */
router.get('/:id',getUserHandler)
/* ------------------------------ follow a user ----------------------------- */

/* ----------------------------- unfollow a user ---------------------------- */

export default router