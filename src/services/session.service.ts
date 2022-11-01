import SessionModel from "../models/session.model";

export async function createSession(userId: string, userAgent: string) {
    try {
      const session = await SessionModel.create({ user: userId, userAgent });
    if (!session)  return  false
     return session.toJSON();
    } catch (err) {
     return false 
    }
  }