import express,{Request,Response} from 'express'
import { createUserHandler, loginUserHandler } from '../controllers/auth.controller';
import validateResource from '../middleware/validateResource';
import { createSessionSchema } from '../schema/session.schema';
import { createUserSchema } from '../schema/users.schema';
import { createUser } from '../services/auth.service'



const router=express.Router()


/* -------------------------------- Register -------------------------------- */
router.get('/register',validateResource(createUserSchema),createUserHandler)

/* ---------------------------------- login --------------------------------- */

router.get('/login',validateResource(createSessionSchema),loginUserHandler)

export default router