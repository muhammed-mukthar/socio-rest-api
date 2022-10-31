import express,{Request,Response} from 'express'
import validateResource from '../middleware/validateResource';
import { createUserSchema } from '../schema/users.schema';
import { createUser } from '../services/auth.service'



const router=express.Router()


/* -------------------------------- Register -------------------------------- */
router.get('/register',validateResource(createUserSchema),async(req:Request,res:Response)=>{
 const user=await createUser(req.body);
 res.json(user)
})

export default router