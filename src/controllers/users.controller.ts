import { Request, Response } from "express";
import { omit } from "lodash";
import UserModel, { UserDocument } from "../models/user.model";


import { DeleteUser, findallUser, findUser, UpdateUser } from "../services/user.service";

import createHashedPass from "../utils/hashpass";

/* ------------------------------- update user ------------------------------ */
export async function updateUserHandler(req: Request, res: Response) {
  console.log(req.body,'bofy here');
  
  //@ts-ignore
  if (req.user._id === req.params.id) {
    // if (req.body.userId === req.params.id ) {
      try {
    if (req.body.password) {

        req.body.password = await createHashedPass(req.body.password);
    }
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
  if (req.user._id === req.params.id || req.user.isAdmin ) {
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
      console.log('i am here');
      
        const user=await findUser({_id:req.params.id})
      
    
       console.log(user,'user here');
       
          res.status(200).json(omit(user,'password'))
       
     
    }catch(err){
         res.status(500).json(err)
    }
   

}


/* ------------------------------ follow a user ----------------------------- */


export async function followHandler(req:Request,res:Response){
    //@ts-ignore
  if(req.user._id !== req.params.id){
    try{
      const user=await findUser({_id:req.params.id})
      //@ts-ignore
      if(!user?.followers.includes(req.user._id)){
          //@ts-ignore
        await UpdateUser({_id:req.params.id},{$push:{followers:req.user._id}})
          //@ts-ignore
        await UpdateUser({_id:req.user._id},{$push:{following:req.params.id}})
        console.log('yay');
        res.json('user has been followed')
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
  //@ts-ignore
  if(req.user._id !== req.params.id){
    try{
      const user=await findUser({_id:req.params.id})
        //@ts-ignore
      const currentUser=await findUser({_id:req.user._id})
        //@ts-ignore
      if(user?.followers.includes(req.user._id)){
          //@ts-ignore
        await UpdateUser({_id:req.params.id},{$pull:{followers:req.user._id}})
          //@ts-ignore
        await UpdateUser({_id:req.user._id},{$pull:{following:req.params.id}})
        res.json('user has been unfollowed')
        console.log('yay');
        
      }else{
        res.status(403).json('you havent followed this user')
        console.log('i am here');
        
      }    
    }catch(err){
      res.status(500).json(err)
    }

  }else{
    res.status(403).json('you cant unfollow yourself')
  }
  
}

//get all user

export async function getAllUsersHandler(req:Request,res:Response) {
  try{
  //@ts-ignore
const userId=req.user._id

console.log(userId,'userId');
const suggestedUser=await  findallUser({followers:{$nin:[userId]}})
console.log(suggestedUser,'sfhkjhsafshdkfsd');
res.json(suggestedUser)
  }catch(err){
  console.log(err,'sfsfadfsda');
    res.json(500).json({error:err}) 
  }
}

export async function blockUserHandler(req:Request,res:Response){

  try {
    await UserModel.findByIdAndUpdate(req.params.id, {
      $set: {blocked:true},
    });
    res.status(200).json("Account blocked successfully");

  } catch (err) {
    return res.status(500).json(err);
  }

}

export async function unblockHandler (req:Request,res:Response)  {

  try {
    await UserModel.findByIdAndUpdate(req.params.id, {
      $set: {blocked:false},
    });
    res.status(200).json("Account unblocked successfully");

  } catch (err) {
    return res.status(500).json(err);
  }

} 