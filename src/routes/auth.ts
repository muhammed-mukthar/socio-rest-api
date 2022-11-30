import express,{Request,Response} from 'express'

import { adminLogin, createUserHandler, loginUserHandler, sentotpHandler, verifyotpHandler } from '../controllers/auth.controller';
import validateResource from '../middleware/validateResource';

import { createUserSchema, loginUserSchema } from '../schema/users.schema';

import {verifyAdmin,VerifyTokenAndReissue} from '../middleware/jwtvalidate'
const serverSID =process.env.Twilio_ServerSID
const accountSID = process.env.Twilio_AccountSID
const authtoken = process.env.Twilio_Authtoken
const client = require('twilio')(accountSID, authtoken)


const router=express.Router()


/* -------------------------------- Register -------------------------------- */
router.post('/register',validateResource(createUserSchema),createUserHandler)

/* ---------------------------------- login --------------------------------- */

router.post('/login',validateResource(loginUserSchema),loginUserHandler)


//admin login
router.post("/admin-login",adminLogin);


router.post('/enterphno', sentotpHandler)


  

  router.post('/otplogin', verifyotpHandler)
     

export default router