import jwt, { JwtPayload } from 'jsonwebtoken'
import config from "config";

const accessTokenSecret=config.get<string >('accessTokenSecret')
const accessTokentime=config.get<string>('accessTokenTtl')
const refreshTokenSecret=config.get<string >('refreshTokenSecret')
const refreshTokenTime=config.get<string>('refreshTokenTtl')

export function generateAccessToken(user:object)  {
    return jwt.sign({ ...user }, accessTokenSecret, {
      expiresIn: accessTokentime,
    });
  };
  
  export function generateRefreshToken(user:object){
    return jwt.sign({ ...user }, refreshTokenSecret,{
        expiresIn:refreshTokenTime
    });
  };

  export function verifyJwt(
    token: string,
    keyName: "accessTokenSecret" | "refreshTokenSecret"
  ) {
    const publicKey = Buffer.from(config.get<string>(keyName));
  
    try {
      const decoded = jwt.verify(token, publicKey);
      console.log('decoded',decoded);
      
      return {
        valid: true,
        expired: false,
        decoded,
      };
    } catch (e: any) {
      console.error(e);
      return {
        valid: false,
        expired: e.message === "jwt expired",
        decoded: null,
      };
    }
  }
  