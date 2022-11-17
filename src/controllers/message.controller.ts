import ConversationModel from '../models/Conversation.model'
import  { Request, Response } from "express";
import MessageModel from '../models/Message.model'
export const addMessage = async (req:Request,res:Response) => {
    const { conversationId, senderId, text } = req.body;
    const message = new MessageModel({
        conversationId,
      senderId,
      text,
    });
    try {
      const result = await message.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  
  export const getMessages = async (req:Request,res:Response) => {
    const { conversationId } = req.params;
    try {
      const result = await MessageModel.find({ conversationId });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  