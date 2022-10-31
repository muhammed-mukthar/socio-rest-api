
import { Request, Response } from "express";
import { createUser } from "../services/auth.service";

export async function createUserHandler(req:Request,res:Response) {
        const user=await createUser(req.body);
        res.json(user)
       }
    
      