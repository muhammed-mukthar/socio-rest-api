
import { Request, Response } from "express";
import { createUser, loginUser } from "../services/auth.service";


/* ------------------------------- create user ------------------------------ */
export async function createUserHandler(req:Request,res:Response) {
    try{
   const user=await createUser(req.body);
        res.json(user)
    }catch(err:any){
        return res.status(409).json(err.message);
    }
     
       }

/* ------------------------------- login user ------------------------------- */
    
export async function loginUserHandler(req:Request,res:Response) {
 loginUser(req.body).then((result)=>{
    if(result){
        res.json(result)
    }else{
        res.status(404).json('user not found')
    }
 })
    
}
      