
import { Request, Response } from "express";
import { createSessionSchema } from "../schema/session.schema";
import {  createUser, loginUser } from "../services/auth.service";
import { createSession } from "../services/session.service";


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
let user=await loginUser(req.body)
    if(user){
        const session=await createSession(user._id,req.get("user-agent")|| "")
        res.json(user)
    }else{
        res.status(404).json('user not found')
    }
 
    
}
      