import mongoose from "mongoose"
import bcrypt from "bcrypt";

export interface AdminInput {
  email: string;
  password: string;
  
}

export interface AdminDocument extends mongoose.Document {
  email: string,
  password:string,
  isAdmin:boolean,
    updatedAt: Date,
    createdAt: Date,
    comparePassword(candidatePassword: string): Promise<Boolean>;
  }

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
AdminSchema.methods.comparePassword = async function (
  passwordInput: string
): Promise<boolean> {
    const user =this as AdminInput
    return bcrypt.compare(passwordInput,user.password)
};

const AdminModel = mongoose.model<AdminDocument>("Admin", AdminSchema);
export default AdminModel
