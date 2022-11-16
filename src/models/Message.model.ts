import mongoose from "mongoose";

export interface MessageDocument extends mongoose.Document {
    conversationId: String,
      sender:  String,
      text:  String,
    updatedAt: Date;
    createdAt: Date;
  }

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<MessageDocument>("Message", MessageSchema);
export default MessageModel
