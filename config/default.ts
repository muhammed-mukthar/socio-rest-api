import dotenv from 'dotenv'

dotenv.config()

export default{
    port :process.env.PORT ||5000,
    dbUrl:process.env.DBURL,
    saltlength: 10,
    accessTokenSecret:process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret:process.env.REFRESH_TOKEN_SECRET,
    accessTokenTtl:'1m',
    refreshTokenTtl:'1w'
}