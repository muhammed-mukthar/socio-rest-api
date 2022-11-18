import express, { Request, Response } from "express";
import { addMessage, getMessages } from "../controllers/message.controller";
const router=express.Router()


router.post('/', addMessage);

router.get('/:conversationId', getMessages);



export default router