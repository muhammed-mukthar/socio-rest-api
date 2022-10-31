import express,{Request,Response} from 'express'
import { createUser } from '../services/user.service'



const router=express.Router()


/* -------------------------------- Register -------------------------------- */
router.get('/register',async(req:Request,res:Response)=>{
 const user=await createUser(req.body);
 res.json(user)
})

export default router