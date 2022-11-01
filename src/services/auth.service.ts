import { omit } from "lodash";
import SessionModel from "../models/session.model";
import UserModel, { UserInput } from "../models/user.model";

/* ------------------------------- create user ------------------------------ */
export async function createUser(input: UserInput) {
  try {
    const user = await UserModel.create(input);

    return omit(user.toJSON(), "password");
  } catch (err: any) {
    console.log("err", err);

    return err;
  }
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return false;
    }
    const isValid = await user.comparePassword(password);
    if (!isValid) return false;

    return omit(user.toJSON(), "password");
  } catch (err: any) {
    return false;
  }
}


