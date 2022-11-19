
import { Request, Response } from "express";
import {  LoginAdmin } from "../services/admin.service";

import {  createUser, loginUser } from "../services/auth.service";

import {  findUser } from "../services/user.service";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils";


/* ------------------------------- create user ------------------------------ */
export async function createUserHandler(req:Request,res:Response) {
    try{
        let userexist=await findUser({email:req.body.email})
        
        
        if(userexist){
            res.json({err:"user already exist"})

        }else{
   const user=await createUser(req.body);
  
        res.json(user)
        }
    

    }catch(err:any){
         res.status(409).json({err:err.message});
    }
     
       }

/* ------------------------------- login user ------------------------------- */
    
export async function loginUserHandler(req:Request,res:Response) {
let user=await loginUser(req.body)//get users details
    if(!user){
        res.status(200).json({message:'user not found'})
    }else{
        let userDetails:object={
            _id:user._id,
            email:user.email,
            // isAdmin:user.isAdmin,
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
    


export async function adminLogin(req:Request,res:Response) {
    try {
        if (req.body.email && req.body.password) {
          const user = await LoginAdmin(req.body);
          if(!user){
            res.status(200).json({message:'user not found'})
        }else{
            let AdminDetails:object={
                _id:user._id,
                email:user.email,
                isAdmin:user.isAdmin,
            }
            const accessToken=generateAccessToken(AdminDetails)
            const refreshToken=generateRefreshToken(AdminDetails)
            res.json({accessToken,refreshToken,...AdminDetails})
        }
         
        } else {
          res.status(400).json("please fill all the credentials")
        }
      } catch (err) {
        res.status(500).json(err)
      }
}