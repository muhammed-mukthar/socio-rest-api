import mongoose from "mongoose"


export interface AdminDocument extends mongoose.Document {
  email: string,
  password:string,
  isAdmin:false,
    updatedAt: Date;
    createdAt: Date;
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


const AdminModel = mongoose.model<AdminDocument>("Conversation", AdminSchema);
export default AdminModel
