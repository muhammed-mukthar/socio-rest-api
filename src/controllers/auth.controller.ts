
import { Request, Response } from "express";

import {  createUser, loginUser } from "../services/auth.service";

import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils";


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
let user=await loginUser(req.body)//get users details
    if(!user){
        res.status(404).json({message:'user not found'})
    }else{

        let userDetails:object={
            id:user._id,
            email:user.email,
            isAdmin:user.isAdmin
        }
        const accessToken=generateAccessToken(userDetails)
        const refreshToken=generateRefreshToken(userDetails)
        res.json({accessToken,refreshToken})
    }
}
    