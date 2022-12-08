import mongoose, { FilterQuery, ObjectId, UpdateQuery } from "mongoose";
import Notif, { NotifDocument } from "../models/notification.model";


export async function findNotif(query: FilterQuery<NotifDocument>) {
    const notif = await Notif.find(query).sort({ createdAt: -1 })
    if (notif) {
        return notif
    } else {
        return false
    }

}

export async function createNotif(input: any ) {
    try {
      const notif = await Notif.create(input);
      if (notif) return notif;
      return false;
    } catch (err) {
      return false;
    }
  }
  
  
export async function updateNotif( filterquery: FilterQuery<NotifDocument>,
    updatequery: UpdateQuery<NotifDocument>) {
    try {
      const notif =  Notif.updateMany(filterquery,updatequery)
      if (notif) return notif;
      return false;
    } catch (err) {
      return false;
    }
  }
  