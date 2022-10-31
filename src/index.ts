import express from 'express'
import config from "config";
import dotenv from 'dotenv'
import connect  from './utils/connect';
import postRoute from './routes/posts'
import userRoute from './routes/users'
import helmet from 'helmet'
import morgan  from  'morgan'

dotenv.config()
const app=express()
const port = config.get<number>("port");
console.log(port);

app.use(express.json())
app.use(helmet())
app.use(morgan('common'))
app.use('/api/posts',postRoute)
app.use('/api/users',userRoute)
app.use('/api/users',userRoute)
app.use('/api/users',userRoute)


app.listen(port,async()=>{
    console.log('app is running on port 5000');
    connect()
    
})