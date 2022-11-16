import mongoose from "mongoose";

export interface ConversationDocument extends mongoose.Document {
    conversationId: String,
      sender:  String,
      text:  String,
    updatedAt: Date;
    createdAt: Date;
  }

const ConversationSchema = new mongoose.Schema(
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

const ConversationModel = mongoose.model<ConversationDocument>("Message", ConversationSchema);
export default ConversationModel
