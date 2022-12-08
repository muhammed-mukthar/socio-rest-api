import { findNotif, updateNotif } from "../services/notif.service"
import { Request, Response } from "express";


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

  