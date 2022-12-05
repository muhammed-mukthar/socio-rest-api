import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { type } from "os";
import { number } from "zod";

export interface UserInput {
  email: string;
  name: string;
  phone:number;
  password: string;
  
}
export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  coverPic: string;
  profilePic: string;
  followers: [];
  following: [];
  profilekey:string;
  coverkey:string;
  desc:string;
  city:string,
  notif:[],
  relationship:number;
  blocked:boolean;
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    profilePic:{ type: String, default: "https://vectorified.com/images/default-profile-picture-icon-3.png" },
    coverPic: { type: String, default: "https://images.fastcompany.net/image/upload/w_596,c_limit,q_auto:best,f_auto/wp-cms/uploads/2021/03/LinkedIn-Default-Background-2020-.jpg" },
    profilekey: { type: String },
    coverkey: { type: String,  },

    followers: {
      type: Array,
      default: [],
    },
    phone:{
      type:Number,


    },
    following: {
      type: Array,
      default: [],
    },
    desc:{
        type:String,
        max:50,
      
      },
      city:{
        type:String,
        max:50,
    
      }, blocked: {
        type: Boolean,
        default:false,
      }, notif:[{type: new mongoose.Schema({
        user: {type:String},  
        name:{type:String},
        profile:{type:String},
        post:{type:String},
        message: { type: String}},
      {timestamps: true})}],
      
      relationship:{
        type:Number,
        enum:[1,2,3],
       
      }
    ,
  },
  {
    timestamps: true,
  }
);


/* -------------------- saving hash password using bcrypt ------------------- */
UserSchema.pre("save", async function (next) {
  let user = this as UserDocument;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(config.get<any>("saltlength"));
  const hash = await bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return next();
});

/* ---------------------------- compare password ---------------------------- */


UserSchema.methods.comparePassword = async function (
  passwordInput: string
): Promise<boolean> {
    const user =this as UserDocument
    return bcrypt.compare(passwordInput,user.password).catch((e)=>false)
};



const UserModel = mongoose.model<UserDocument>("User", UserSchema);
export default UserModel