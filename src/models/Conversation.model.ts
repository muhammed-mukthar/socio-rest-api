import mongoose from "mongoose";


export interface Conversationinput extends mongoose.Document{
  members: Array<string>,
}

export interface ConversationDocument extends mongoose.Document {
    members: Array<string>,
    updatedAt: Date;
    createdAt: Date;
  }

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

const ConversationModel = mongoose.model<ConversationDocument>("Conversation", ConversationSchema);
export default ConversationModel
