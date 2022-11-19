import express,{Request,Response} from 'express'

import { adminLogin, createUserHandler, loginUserHandler } from '../controllers/auth.controller';
import validateResource from '../middleware/validateResource';

import { createUserSchema, loginUserSchema } from '../schema/users.schema';

import {verifyAdmin,VerifyTokenAndReissue} from '../middleware/jwtvalidate'




const router=express.Router()


/* -------------------------------- Register -------------------------------- */
router.post('/register',validateResource(createUserSchema),createUserHandler)

/* ---------------------------------- login --------------------------------- */

router.post('/login',validateResource(loginUserSchema),loginUserHandler)


//admin login
router.post("/admin-login",adminLogin);

export default router