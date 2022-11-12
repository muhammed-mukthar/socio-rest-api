import { Request, Response } from "express";
import { omit } from "lodash";
import UserModel, { UserDocument } from "../models/user.model";


import { DeleteUser, findUser, UpdateUser } from "../services/user.service";

import createHashedPass from "../utils/hashpass";

/* ------------------------------- update user ------------------------------ */
export async function updateUserHandler(req: Request, res: Response) {
  console.log(req.body,'bofy here');
  
  //@ts-ignore
  if (req.user.id === req.params.id) {
    // if (req.body.userId === req.params.id ) {
    if (req.body.password) {
      try {
        req.body.password = await createHashedPass(req.body.password);
      } catch (err) {
        return res.status(403).json("you can only update your account");
      }
    }
    try {
      await UpdateUser(
        { _id: req.params.id },
        { $set: req.body }
      );
      res.status(200).json("Account has been updated");
    } catch (error) {
      return res.status(403).json("you can only update your account");
    }
  }else{
    res.status(403).json('you can only update your account')
  }
}

/* ------------------------------- delete user ------------------------------ */

export async function deleteUserHandler(req: Request, res: Response) {
  // @ts-ignore
  if (req.body.userId === req.params.id || req.user.isAdmin ) {
  
    try {  
       DeleteUser(req.params.id).then(()=>res.status(200).json("Account has been Deleted"))
       .catch(()=>res.status(403).json("error happend while deleting"))
      
    } catch (error) {
      return res.status(403).json("you can only update your account");
    }
  }else{
    res.status(301).json('you are not permitted to do that')
  }
}



/* ------------------------------- get a user ------------------------------- */



export async function getUserHandler(req:Request,res:Response){

    try{
        const user=await findUser({_id:req.params.id})
      
    
       
          res.status(200).json(omit(user,'password','updatedAt'))
       
     
    }catch(err){
         res.status(500).json(err)
    }
   

}


/* ------------------------------ follow a user ----------------------------- */


export async function followHandler(req:Request,res:Response){
  if(req.body.userId !== req.params.id){
    try{
      const user=await findUser({_id:req.params.id})
      const currentUser=await findUser({_id:req.body.userId})
      if(!user?.followers.includes(req.body.userId)){
        await UpdateUser({_id:req.params.id},{$push:{followers:req.body.userId}})
        await UpdateUser({_id:req.body.userId},{$push:{following:req.params.id}})
        res.send('user has been followed')
      }else{
        res.status(403).json('you already follow this user')
      }    
    }catch(err){
      res.status(500).json(err)
    }

  }else{
    res.status(403).json('you cant follow yourself')
  }
}

/* ------------------------------ unfollow user ----------------------------- */

export async function unfollowHandler(req:Request,res:Response) {
  if(req.body.userId !== req.params.id){
    try{
      const user=await findUser({_id:req.params.id})
      const currentUser=await findUser({_id:req.body.userId})
      if(user?.followers.includes(req.body.userId)){
        await UpdateUser({_id:req.params.id},{$pull:{followers:req.body.userId}})
        await UpdateUser({_id:req.body.userId},{$pull:{following:req.params.id}})
        res.send('user has been unfollowed')
      }else{
        res.status(403).json('you havent followed this user')
      }    
    }catch(err){
      res.status(500).json(err)
    }

  }else{
    res.status(403).json('you cant unfollow yourself')
  }
  
}