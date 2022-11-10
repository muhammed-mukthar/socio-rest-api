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

  export  function verifyJwt(
    token: string,
    keyName: "accessTokenSecret" | "refreshTokenSecret"
  ) {
    const publicKey = config.get<string>(keyName);
  console.log(publicKey,'publickey');
    try {
      const decoded = jwt.verify(token, publicKey);
      console.log(decoded,'jfskhfsksfalhklfsa');
      if(decoded){
         return {
        valid: true,
        expired: false,
        decoded,
      };
      }else{
        return {
          valid: false,
          expired:  "invalid accessToken",
          decoded: null,
        };
      }
      
     
    } catch (e: any) {
      console.error(e);
      return {
        valid: false,
        expired: e.message === "jwt expired",
        decoded: null,
      };
    }
  }
  