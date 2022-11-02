import UserModel, { UserDocument } from "../models/user.model";
import { FilterQuery, Query, UpdateQuery } from "mongoose";
import createHashedPass from "../utils/hashpass";

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}

export async function UpdateUser(filterquery: FilterQuery<UserDocument> ,updatequery:UpdateQuery<UserDocument>) {
  try {
    let updatedUser = await UserModel.findByIdAndUpdate(filterquery,updatequery);
    return updatedUser;
  } catch (err) {
    return false;
  }
}


export async function DeleteUser(userId:any ) {
  try {
   await UserModel.deleteOne({_id:userId});
    return true;
  } catch (err) {
    return err;
  }
}
