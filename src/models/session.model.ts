import mongoose from 'mongoose'
import {UserDocument} from './user.model'


export interface SessoionDocument extends mongoose.Document{
    user:UserDocument["_id"],
    vali:boolean;
    userAgenet:string;
    createdAt:Date;
    updatedAt:Date;
}

const SessionSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    valid:{type:Boolean,default:true},
    userAgent:{type:String}
},{
    timestamps:true
})

const SessionModel=mongoose.model<SessoionDocument>("Session",SessionSchema)

export default SessionModel