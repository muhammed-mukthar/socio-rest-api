import { Request, Response } from "express";
import { DeleteUser, UpdateUser } from "../services/user.service";

import createHashedPass from "../utils/hashpass";

/* ------------------------------- update user ------------------------------ */
export async function updateUserHandler(req: Request, res: Response) {
  if (req.body.userId === req.params.id || res.locals.user.id) {
    if (req.body.password) {
      try {
        req.body.password = await createHashedPass(req.body.password);
      } catch (err) {
        return res.status(403).json("you can only update your account");
      }
    }
    try {
      const updatedUser = await UpdateUser(
        { _id: req.params.id },
        { $set: req.body }
      );
      res.status(200).json("Account has been updated");
    } catch (error) {
      return res.status(403).json("you can only update your account");
    }
  }
}

/* ------------------------------- delete user ------------------------------ */

export async function deleteUserHandler(req: Request, res: Response) {
  if (req.body.userId === req.params.id ) {
    console.log(req.params.id);
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
