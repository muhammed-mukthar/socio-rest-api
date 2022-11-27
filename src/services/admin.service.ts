import AdminModel, { AdminInput } from "../models/admin.model";
import { omit } from "lodash";
import { FilterQuery } from "mongoose";

/* ------------------------------- find adnin ------------------------------ */
export async function LoginAdmin({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      const user = await AdminModel.findOne({ email });
    if (!user) {
        return false;
      }
      const isValid = await user.comparePassword(password);
      console.log(isValid,'is valid checking');
      if (!isValid) return false;
      return omit(user.toJSON(), "password");
    }catch(err){
      console.log(err);
      
    }
  
  }
  