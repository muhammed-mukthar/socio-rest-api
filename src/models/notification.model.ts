import mongoose from "mongoose";
import { boolean } from "zod";

export interface NotifDocument extends mongoose.Document {
    user: String,
    name:  String,
    profile:  String,
    post:String;
    postPic: String;
    message:String;
    updatedAt: Date;
    createdAt: Date;
  }

const NotifSchema = new mongoose.Schema(
  {
    user: {type:String},  
    sender: {type:String},  
    name:{type:String},
    profile:{type:String},
    post:{type:String},
    postPic:{type:String},
    isVisited:{type:Boolean,
    default:false},
    message: { type: String}},
  {timestamps: true},
);

const NotifeModel = mongoose.model<NotifDocument>("Notification", NotifSchema);
export default NotifeModel
