"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NotifSchema = new mongoose_1.default.Schema({
    user: { type: String },
    sender: { type: String },
    name: { type: String },
    profile: { type: String },
    post: { type: String },
    postPic: { type: String },
    isVisited: { type: Boolean,
        default: false },
    message: { type: String }
}, { timestamps: true });
const NotifeModel = mongoose_1.default.model("Notification", NotifSchema);
exports.default = NotifeModel;
