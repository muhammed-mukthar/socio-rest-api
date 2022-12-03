
import { Request, Response } from "express";
import { LoginAdmin } from "../services/admin.service";

import { createUser, loginUser } from "../services/auth.service";

import { findUser } from "../services/user.service";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils";

const serverSID = process.env.Twilio_ServerSID
const accountSID = process.env.Twilio_AccountSID
const authtoken = process.env.Twilio_Authtoken
const client = require('twilio')(accountSID, authtoken)
/* ------------------------------- create user ------------------------------ */
export async function createUserHandler(req: Request, res: Response) {
  try {
    let userexist = await findUser({ $or: [ { email:req.body.email}, { phone: req.body.phone } ]})


    if (userexist) {
      res.json({ err: "user already exist" })

    } else {
      const user = await createUser(req.body);

      res.json(user)
    }


  } catch (err: any) {
    res.status(409).json({ err: err.message });
  }

}

/* ------------------------------- login user ------------------------------- */

export async function loginUserHandler(req: Request, res: Response) {
  let user = await loginUser(req.body)//get users details
  if (!user) {
    res.status(200).json({ message: 'user not found' })
  } else {
    let userDetails: object = {
      _id: user._id,
      email: user.email,
      // isAdmin:user.isAdmin,
      profilePic: user.profilePic,
      followers: user?.followers,
      following: user?.following,
      notif: user?.notif,
      name: user.name

    }
    const accessToken = generateAccessToken(userDetails)
    const refreshToken = generateRefreshToken(userDetails)
    res.json({ accessToken, refreshToken, ...userDetails })
  }
}



export async function adminLogin(req: Request, res: Response) {
  try {
    if (req.body.email && req.body.password) {
      const user = await LoginAdmin(req.body);

      if (!user) {
        res.status(200).json({ message: 'user not found' })
      } else if (user.blocked) {
        res.status(200).json({ message: 'user is restricted ' })
      } else {
        let AdminDetails: object = {
          _id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        }
        const accessToken = generateAccessToken(AdminDetails)
        const refreshToken = generateRefreshToken(AdminDetails)
        res.json({ accessToken, refreshToken, ...AdminDetails })
      }

    } else {
      res.status(400).json("please fill all the credentials")
    }
  } catch (err) {
    res.status(500).json(err)
  }
}


export async function verifyotpHandler(req: Request, res: Response) {
  const { otp, phno } = req.body
  client.verify
    .services(serverSID)
    .verificationChecks.create({ to: `+91${phno}`, code: otp })
    .then(async (resp: { valid: any; }) => {
      console.log(resp);
      if (!resp.valid) {
        res.json({err:"invalid otp"})
      } else {
        let user = await findUser({ phone: req.body.phno })//get users details
        console.log(user);
        
        if (!user) {
          res.status(200).json({ message: 'user not found' })
        } else {
          let userDetails: object = {
            _id: user._id,
            email: user.email,
            // isAdmin:user.isAdmin,
            profilePic: user.profilePic,
            followers: user?.followers,
            following: user?.following,
            notif: user?.notif,
            name: user.name
      
          }
          const accessToken = generateAccessToken(userDetails)
          const refreshToken = generateRefreshToken(userDetails)
          res.json({ accessToken, refreshToken, ...userDetails })
        }
      }
    }).catch((err: any) => {
      console.log(err)
      res.json({ err: "error happend in otp verify" })

    })


}


export async function sentotpHandler(req: Request, res: Response) {
try{


  console.log(req.body);
const user=await findUser({ phone: req.body.phno })
if(!user){
  res.json({err:"user not found register first"})
}else{
    client.verify
    .services(serverSID)
    .verifications.create({
      to: `+91${req.body.phno}`,
      channel: 'sms',
    })
    .then((data: any) => {
      res.json('otp sent')
    })
    .catch((err: any) => {
      res.json({ err: "otp cannot be sent " })
    })
}
}catch(err){
  res.json({err:err})
}
}