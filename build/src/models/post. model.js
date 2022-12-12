"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId, ref: "User",
        required: true
    },
    desc: {
        type: String,
        max: 500
    },
    img: {
        type: String,
    },
    key: {
        type: String,
    },
    reports: {
        type: Array,
    },
    likes: {
        type: Array,
    },
    comments: [{ type: new mongoose_1.default.Schema({
                user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", },
                name: { type: String },
                profile: { type: String },
                comment: { type: String }
            }, { timestamps: true }) }],
}, {
    timestamps: true,
});
const PostModel = mongoose_1.default.model("Post", PostSchema);
exports.default = PostModel;
