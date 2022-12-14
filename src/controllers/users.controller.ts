import { Request, Response } from "express";
import { omit } from "lodash";
import UserModel, { UserDocument } from "../models/user.model";
import { createNotif, findNotif } from "../services/notif.service";


import { DeleteUser, findallUser, findUser, UpdateUser } from "../services/user.service";

import createHashedPass from "../utils/hashpass";

/* ------------------------------- update user ------------------------------ */
export async function updateUserHandler(req: Request, res: Response) {

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
  } else {
    res.status(403).json('you can only update your account')
  }
}

/* ------------------------------- delete user ------------------------------ */

export async function deleteUserHandler(req: Request, res: Response) {
  // @ts-ignore
  if (req.user._id === req.params.id || req.user.isAdmin) {
    try {
      DeleteUser(req.params.id).then(() => res.status(200).json("Account has been Deleted"))
        .catch(() => res.status(403).json("error happend while deleting"))

    } catch (error) {
      return res.status(403).json("you can only update your account");
    }
  } else {
    res.status(301).json('you are not permitted to do that')
  }
}



/* ------------------------------- get a user ------------------------------- */



export async function getUserHandler(req: Request, res: Response) {

  try {


    const user = await findUser({ _id: req.params.id })


    res.status(200).json(omit(user, 'password'))


  } catch (err) {
    res.status(500).json(err)
  }


}


/* ------------------------------ follow a user ----------------------------- */


export async function followHandler(req: {
  user: {
    name: any; _id: any;
  }; params: { id: any; }; body: {
    message: any; name: any; comments: any; profile: any;
  };
}, res: Response) {

  if (req.user._id !== req.params.id) {
    try {
      const user = await findUser({ _id: req.params.id })
      const currentuser = await findUser({ _id: req.user._id })
      const notif=await findNotif({user:req.params.id})
console.log(notif);

      if (currentuser && notif) {
        const checkUseralreadyfollow = (obj: { user: any; }) => obj.user == currentuser._id;
console.log(notif.some(checkUseralreadyfollow));

        if (notif.some(checkUseralreadyfollow)) {
          await UpdateUser({ _id: req.params.id }, { $push: { followers: req.user._id } })

          await UpdateUser({ _id: req.user._id }, { $push: { following: req.params.id } })

          res.json('user has been followed')
        } else {
          const notif = {

            user: user?._id,
            sender:currentuser._id,

            name: currentuser.name,

            message: `${currentuser.name} started following you`,
            
            profile: currentuser.profilePic
          }


          //@ts-ignore
          if (!user?.followers.includes(req.user._id)) {
     
            await createNotif(notif)
            await UpdateUser({ _id: req.params.id }, { $push: { followers: req.user._id} })

            await UpdateUser({ _id: req.user._id }, { $push: { following: req.params.id } })

            res.json('user has been followed')

          } else {
            res.status(403).json('you already follow this user')
          }
        }

      } else {
        res.status(403).json('current user cannot be found')
      }
    } catch (err) {
      console.log(err,'error');
      
      res.status(500).json(err)
    }

  } else {
    res.status(403).json('you cant follow yourself')
  }
}

/* ------------------------------ unfollow user ----------------------------- */

export async function unfollowHandler(req: Request, res: Response) {
  //@ts-ignore
  if (req.user._id !== req.params.id) {
    try {
      const user = await findUser({ _id: req.params.id })
      //@ts-ignore
      const currentUser = await findUser({ _id: req.user._id })
      //@ts-ignore
      if (user?.followers.includes(req.user._id)) {
        //@ts-ignore
        await UpdateUser({ _id: req.params.id }, { $pull: { followers: req.user._id } })
        //@ts-ignore
        await UpdateUser({ _id: req.user._id }, { $pull: { following: req.params.id } })
        res.json('user has been unfollowed')


      } else {
        res.status(403).json('you havent followed this user')


      }
    } catch (err) {
      res.status(500).json(err)
    }

  } else {
    res.status(403).json('you cant unfollow yourself')
  }

}

//get all user

export async function getAllUsersHandler(req: Request, res: Response) {
  try {
    //@ts-ignore
    const userId = req.user._id


    const suggestedUser = await findallUser({ followers: { $nin: [userId] } })

    res.json(suggestedUser)
  } catch (err) {

    res.json(500).json({ error: err })
  }
}

export async function blockUserHandler(req: Request, res: Response) {

  try {
    await UserModel.findByIdAndUpdate(req.params.id, {
      $set: { blocked: true },
    });
    res.status(200).json("Account blocked successfully");

  } catch (err) {
    return res.status(500).json(err);
  }

}

export async function unblockHandler(req: Request, res: Response) {

  try {
    await UserModel.findByIdAndUpdate(req.params.id, {
      $set: { blocked: false },
    });
    res.status(200).json("Account unblocked successfully");

  } catch (err) {
    return res.status(500).json(err);
  }

}


export async function getFriendsHandler(req: Request, res: Response) {
  try {
    //@ts-ignore
    const user = await UserModel.findById(req.params.userId);
    console.log(user, 'user here');

    const friends = await Promise.all(
      //@ts-ignore
      user.following.map((friendId: any) => {
        return UserModel.findById(friendId);
      })
    );
    let friendList: { _id: any; name: string; profilePic: string; }[] = [];
    friends.map((friend) => {
      if (friend != null) {
        const { _id, name, profilePic } = friend;
        friendList.push({ _id, name, profilePic });
      }

    });
    res.status(200).json(friendList)
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
    console.log(err);
  }
}


export async function filterHandler(req: { body: { search: string; }; } ,res:Response){
  try{
    console.log('i am here');
    
    var search=''
    if(req.body.search){
      search=req.body.search
    }
    // console.log(req.query);
    
    let userdetails = await findallUser({$or:[
      {
       name:{$regex:'.*'+search+'.*',$options:'i'} 
      }
    ]})
    console.log(userdetails);
    
    res.json(userdetails)
  }catch(err){
    res.status(500).json('some error happpened in searching')
  }
 
}

export async function getFollowersHandler(req: Request,res:Response){
  try{
    findUser({_id:req.params.id})
    .then(async (currentUser)=>{
      if(!currentUser) return res.status(403).json('errpr happened user not found')
      console.log(currentUser);
      const followers = await Promise.all(
        currentUser.followers.map((followerId) => {
          return findUser({ _id: followerId });
        })
      );
      res.status(200).json(followers)
    })
    .catch((error)=> res.status(500).json(error))  
  }catch(err){
    res.status(500).json('error happend ')
  }
}

export async function getFollowingsHandler(req: Request,res:Response){
  try {
  findUser({_id:req.params.id})
    .then(async (currentUser)=>{
      if(!currentUser) return res.status(403).json('errpr happened user not found')

      console.log(currentUser);
      const followings = await Promise.all(
        currentUser.following.map((followingId) => {
          return findUser({ _id: followingId });
        })
      );
      res.status(200).json(followings)
    })
    .catch((error)=> res.status(500).json(error))  
  } catch (err) {
    res.status(500).json(err);
  }
}