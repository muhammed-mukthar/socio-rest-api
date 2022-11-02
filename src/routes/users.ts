import express,{Request,Response} from 'express'
import { updateUserHandler } from '../controllers/users.controller'
import UserModel from '../models/user.model'

const router=express.Router()


/* ------------------------------- update user ------------------------------ */

router.put('/:id',updateUserHandler)
/* ------------------------------- delete user ------------------------------ */

/* ------------------------------- get a user ------------------------------- */

/* ------------------------------ follow a user ----------------------------- */

/* ----------------------------- unfollow a user ---------------------------- */

export default router