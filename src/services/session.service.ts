import SessionModel from "../models/session.model";
import {ObjectId} from "mongoose";

export async function createSession(userId:any , userAgent: string) {
    try {
      const session = await SessionModel.create({ user: userId, userAgent });
    if (!session)  return  false
     return session.toJSON();
    } catch (err) {
     return false 
    }
  }