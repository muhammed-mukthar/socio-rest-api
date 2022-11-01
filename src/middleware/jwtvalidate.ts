import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'
export const verify = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
  
      jwt.verify(token, "mySecretKey", (err:any, user) => {
        if (err) {
          return res.status(403).json("Token is not valid!");
        }
  
        res.locals.user=user
        next();
      });
    } else {
      res.status(401).json("You are not authenticated!");
    }
  };