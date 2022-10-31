import express,{Request,Response} from 'express'
import { createUserHandler } from '../controllers/auth.controller';
import validateResource from '../middleware/validateResource';
import { createUserSchema } from '../schema/users.schema';
import { createUser } from '../services/auth.service'



const router=express.Router()


/* -------------------------------- Register -------------------------------- */
router.get('/register',validateResource(createUserSchema),createUserHandler)

export default router