import express,{Request,Response} from 'express'
import { fromJSON } from 'postcss';
import { createUserHandler, loginUserHandler } from '../controllers/auth.controller';
import validateResource from '../middleware/validateResource';
import { createSessionSchema } from '../schema/session.schema';
import { createUserSchema } from '../schema/users.schema';

import {verifyAdmin,verifyTokenAndAuthorization,VerifyTokenAndReissue} from '../middleware/jwtvalidate'




const router=express.Router()


/* -------------------------------- Register -------------------------------- */
router.get('/register',validateResource(createUserSchema),createUserHandler)

/* ---------------------------------- login --------------------------------- */

router.get('/login',validateResource(createSessionSchema),loginUserHandler)


export default router