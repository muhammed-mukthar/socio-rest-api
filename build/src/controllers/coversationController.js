"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findChat = exports.userChats = exports.createChat = void 0;
const Conversation_model_1 = __importDefault(require("../models/Conversation.model"));
const createChat = async (req, res) => {
    const newChat = new Conversation_model_1.default({
        members: [req.body.senderId, req.body.receiverId],
    });
    try {
        const result = await newChat.save();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.createChat = createChat;
const userChats = async (req, res) => {
    try {
        const chat = await Conversation_model_1.default.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(chat);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.userChats = userChats;
const findChat = async (req, res) => {
    try {
        const chat = await Conversation_model_1.default.findOne({
            members: { $all: [req.params.firstId, req.params.secondId] },
        });
        if (chat) {
            res.status(200).json(chat);
        }
        else {
            // const newChat = new ConversationModel({
            //   members: [req.body.senderId, req.body.receiverId],
            // });
            //   const result = await newChat.save();
            res.status(200).json({ message: 'conversation not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
};
exports.findChat = findChat;
