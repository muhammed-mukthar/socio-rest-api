import jwt from 'jsonwebtoken'
import config from "config";

const accessTokenSecret=config.get<string >('accessTokenSecret')
const accessTokentime=config.get<string>('accessTokenTtl')
const refreshTokenSecret=config.get<string >('refreshTokenSecret')
const refreshTokenTime=config.get<string>('refreshTokenTtl')

export function generateAccessToken(user:object,sessionId:string)  {
    return jwt.sign({ ...user,sessionId }, accessTokenSecret, {
      expiresIn: accessTokentime,
    });
  };
  
  export function generateRefreshToken(user:object,sessionId:string){
    return jwt.sign({ ...user,sessionId }, refreshTokenSecret,{
        expiresIn:refreshTokenTime
    });
  };

  