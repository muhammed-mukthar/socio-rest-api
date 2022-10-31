import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
export interface UserInput {
  email: string;
  name: string;
  password: string;
  coverPic: string;
  profilePic: string;
  followers: string[];
  following: string[];
  isAdmin: boolean;
}
export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    coverPic: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
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
  const salt = await bcrypt.genSalt(config.get<number>("saltlength"));
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


module.exports=mongoose.model("User",UserSchema)