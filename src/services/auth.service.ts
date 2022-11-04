import { omit } from "lodash";
import config from "config";

import UserModel, { UserInput } from "../models/user.model";
import { generateAccessToken, verifyJwt } from "../utils/jwt.utils";
import { findUser } from "./user.service";

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

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken, 'refreshTokenSecret');
console.log(decoded,'decoded');

  if (!decoded ) return false;
console.log('I am here');

//@ts-ignore
  const user = await findUser({ _id: decoded.id });

  if (!user) return false;


  let userDetails:object={
    id:user._id,
    email:user.email,
    isAdmin:user.isAdmin
}
  const accessToken = generateAccessToken(userDetails)

  return accessToken;
}
