import express, { NextFunction,Request,Response } from 'express'
import config from "config";
import dotenv from 'dotenv'
import connect  from './utils/connect';
import postRoute from './routes/posts'
import userRoute from './routes/users'
import authRoute from './routes/auth'
import uploadRoute from './routes/upload';
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan  from  'morgan'
import cors from 'cors'
dotenv.config()
const app=express()
const port = config.get<number>("port");



  app.use(cookieParser());
  app.use(express.json());
  
//   app.use((req:Request, res:Response, next:NextFunction) => {
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
//   });
  app.use(
    cors({
      origin: "http://127.0.0.1:5173",
    })
  );
app.use(helmet())
app.use(morgan('common'))
app.use(cors())
app.use('/api/posts',postRoute)
app.use('/api/users',userRoute)
app.use('/api/auth',authRoute)
app.use('/api/uploads',uploadRoute)

app.listen(port,async()=>{
    console.log('app is running on port 5000');
    connect()
    
})