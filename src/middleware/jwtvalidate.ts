import { get } from "lodash";
import { Request, Response, NextFunction, request } from "express";
import { verifyJwt } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../services/auth.service";



export const VerifyTokenAndReissue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('i am here');
  
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );
  const refreshToken = get(req, "headers.x-refresh");


  if (!accessToken) {
    res.status(403).json('you are not allowed to do it')
  }else{
    const { decoded, expired } = verifyJwt(accessToken, "accessTokenSecret");
console.log(decoded,expired,'decodedfsdfsdfsdfsd');

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }else if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });
console.log(newAccessToken);

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
      const result = verifyJwt(newAccessToken, "accessTokenSecret");

    res.locals.user = result.decoded;
    return next();
    }else{
      res.json('cannot send new access token')
    }

    
  }else{
    res.status(403).json('token not valid')
  }
  }
};

export const verifyTokenAndAuthorization = (req:Request, res:Response, next:NextFunction) => {
  VerifyTokenAndReissue(req, res, () => {
    const user=res.locals.user
    console.log(user,'user here');
    
    if (user.id === req.params.id || user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

export const verifyAdmin=async (
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



