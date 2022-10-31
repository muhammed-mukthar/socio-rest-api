import dotenv from 'dotenv'

dotenv.config()

export default{
    port :process.env.PORT ||5000,
    dbUrl:process.env.DBURL,
    saltlength: 10
}