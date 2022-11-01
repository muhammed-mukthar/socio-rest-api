import UserModel, { UserDocument } from "../models/user.model";
import { FilterQuery } from "mongoose";

 export async function findUser(query: FilterQuery<UserDocument>) {
    return UserModel.findOne(query).lean();
  }