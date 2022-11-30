import ConversationModel from '../models/Conversation.model'
import  { Request, Response } from "express";

export const createChat = async (req:Request,res:Response) => {
    const newChat = new ConversationModel({
      members: [req.body.senderId, req.body.receiverId],
    });
    try {
      const result = await newChat.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  
  export const userChats = async (req:Request,res:Response) => {
    try {
      const chat = await ConversationModel.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  
  export const findChat = async (req:Request,res:Response) => {
    try {
      const chat = await ConversationModel.findOne({
        members: { $all: [req.params.firstId, req.params.secondId] },
      });
      if(chat){
        res.status(200).json(chat)
      }else{
        // const newChat = new ConversationModel({
        //   members: [req.body.senderId, req.body.receiverId],
        // });
        //   const result = await newChat.save();
          res.status(200).json({message:'conversation not found'})

      }
    } catch (error) {
      res.status(500).json({error:error})
    }
  };