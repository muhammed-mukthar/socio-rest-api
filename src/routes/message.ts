import express, { Request, Response } from "express";
import { addMessage, getMessages } from "../controllers/message.controller";
const router=express.Router()
import Message from '../models/Message.model'

router.post('/', addMessage);

router.get('/:chatId', getMessages);



export default router