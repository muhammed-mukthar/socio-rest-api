import express,{Request,Response} from 'express'

import { createUserHandler, loginUserHandler } from '../controllers/auth.controller';
import validateResource from '../middleware/validateResource';

import { createUserSchema, loginUserSchema } from '../schema/users.schema';

import {verifyAdmin,verifyTokenAndAuthorization,VerifyTokenAndReissue} from '../middleware/jwtvalidate'




const router=express.Router()


/* -------------------------------- Register -------------------------------- */
router.get('/register',validateResource(createUserSchema),createUserHandler)

/* ---------------------------------- login --------------------------------- */

router.get('/login',validateResource(loginUserSchema),loginUserHandler)


export default router