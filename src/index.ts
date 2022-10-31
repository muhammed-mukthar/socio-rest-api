import express from 'express'
import config from "config";
import dotenv from 'dotenv'
import connect  from './utils/connect';
dotenv.config()
const app=express()
const port = config.get<number>("port");
console.log(port);

app.use(express.json())

app.listen(port,async()=>{
    console.log('app is running on port 5000');
    connect()
    
})