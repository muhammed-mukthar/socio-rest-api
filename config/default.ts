import dotenv from 'dotenv'
import { number } from 'zod'
dotenv.config()

export default{
    port :process.env.PORT ||5000,
    dbUrl:process.env.DBURL,
    saltlength: 10
}