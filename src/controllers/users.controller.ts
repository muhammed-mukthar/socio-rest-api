import { Request, Response } from "express";
import { omit } from "lodash";
import UserModel, { UserDocument } from "../models/user.model";


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

      if (currentuser) {
        const checkUseralreadyfollow = (obj: { user: { user: string; }; }) => obj.user == currentuser._id;
console.log(user?.notif.some(checkUseralreadyfollow));

        if (user?.notif.some(checkUseralreadyfollow)) {
          await UpdateUser({ _id: req.params.id }, { $push: { followers: req.user._id } })

          await UpdateUser({ _id: req.user._id }, { $push: { following: req.params.id } })

          res.json('user has been followed')
        } else {
          const notif = {

            user: currentuser?._id,

            name: currentuser.name,

            message: `${currentuser.name} started following you`,
            
            profile: currentuser.profilePic
          }


          //@ts-ignore
          if (!user?.followers.includes(req.user._id)) {

            await UpdateUser({ _id: req.params.id }, { $push: { followers: req.user._id, notif: notif } })

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

