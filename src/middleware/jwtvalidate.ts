import { get } from "lodash";
import { Request, Response, NextFunction, request } from "express";
import { verifyJwt } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../services/auth.service";



const VerifyTokenAndReissue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );
  const refreshToken = get(req, "headers.x-refresh");

  if (!accessToken) {
    res.status(403).json('InvalidToken')
  }else{
    const { decoded, expired } = verifyJwt(accessToken, "accessTokenSecret");

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }else if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
    }

    const result = verifyJwt(newAccessToken as string, "accessTokenSecret");

    res.locals.user = result.decoded;
    return next();
  }else{
    res.status(403).json('token not valid')
  }
  }
};

const verifyTokenAndAuthorization = (req:Request, res:Response, next:NextFunction) => {
  VerifyTokenAndReissue(req, res, () => {
    const user=res.locals.user
    if (user.id === req.params.id || user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

const verifyAdmin=async (
  req: Request,
  res: Response,
  next: NextFunction
)=>{
VerifyTokenAndReissue(req,res,()=>{
  const user=res.locals.user
  if (user.isAdmin) {
    next();
  } else {
    res.status(403).json("You are not alowed to do that!");
  }
})

  };


module.exports=  {VerifyTokenAndReissue,verifyTokenAndAuthorization,verifyAdmin};
