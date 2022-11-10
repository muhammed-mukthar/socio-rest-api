
import { Request, Response } from "express";

import {  createUser, loginUser } from "../services/auth.service";

import {  findUser } from "../services/user.service";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils";


/* ------------------------------- create user ------------------------------ */
export async function createUserHandler(req:Request,res:Response) {
    try{
        let userexist=await findUser({email:req.body.email})
        console.log(userexist);
        
        if(userexist){
            res.json({err:"user already exist"})

        }else{
   const user=await createUser(req.body);
  
        res.json(user)
        }
    

    }catch(err:any){
         res.status(409).json(err.message);
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
            isAdmin:user.isAdmin,
            profilePic:user.profilePic,
            followers:user.followers,
            following:user.following,
            name:user.name

        }
        const accessToken=generateAccessToken(userDetails)
        const refreshToken=generateRefreshToken(userDetails)
        res.json({accessToken,refreshToken,...userDetails})
    }
}
    