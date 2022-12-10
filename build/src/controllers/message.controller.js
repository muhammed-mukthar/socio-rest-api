"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.addMessage = void 0;
const Message_model_1 = __importDefault(require("../models/Message.model"));
const addMessage = async (req, res) => {
    const { conversationId, senderId, text } = req.body;
    const message = new Message_model_1.default({
        conversationId,
        senderId,
        text,
    });
    try {
        const result = await message.save();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.addMessage = addMessage;
const getMessages = async (req, res) => {
    const { conversationId } = req.params;
    try {
        const result = await Message_model_1.default.find({ conversationId });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getMessages = getMessages;
