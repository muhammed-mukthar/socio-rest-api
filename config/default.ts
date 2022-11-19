import dotenv from 'dotenv'

dotenv.config()

export default{
    port :process.env.PORT ||5000,
    dbUrl:process.env.DBURL,
    saltlength: 10,
    accessTokenSecret:process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret:process.env.REFRESH_TOKEN_SECRET,
    accessTokenTtl:'1w',
    refreshTokenTtl:'1w',
    AWS_ACESS:process.env.AWS_ACESS,
  AWS_SECRET:process.env.AWS_SECRET,
  AWS_BUCKET_NAME:process.env.AWS_BUCKET_NAME,
   AWS_BUCKET_REGION:process.env.AWS_BUCKET_REGION
}