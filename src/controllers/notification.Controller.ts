import { createNotif, findNotif, updateNotif } from "../services/notif.service"
import { Request, Response } from "express";
import { findUser } from "../services/user.service";


export async function getallNotfiHandler(req:Request, res: Response) {

    try {
        const allnotif = await findNotif({ user: req.params.id })

        if (allnotif) {
          
            res.json(allnotif)

        } else {
          
            res.json({ err: "no user here" })
        }



    } catch (error) {
       
        res.status(500).json({err:error})
    }
}


export async function updateNotfiHandler(req: Request, res: Response) {
    try{
       updateNotif({user:req.params.id, isVisited:false},
        {
            $set:{
                isVisited:true
            }
        }) .then((response)=>{
                res.status(200).json(response)
            })
    }catch(error){
        res.status(500).json(error)
    }
}

export async function createNotificationHandler(req: Request, res: Response){
    try{
        let {senderId,recieverId}=req.body

        const currentuser = await findUser({ _id: senderId })
        const notif = {
            user: recieverId,
            name: currentuser?.name,
            sender:currentuser?._id,
            message: `${currentuser?.name} sent a message  `,
            profile: currentuser?.profilePic
          }
         await createNotif(notif)

        if (notif) {
            res.json(notif)
        } else {
            res.json({ err: "notification error" })
}
    }catch(error){
        res.status(500).json(error)
    }
}