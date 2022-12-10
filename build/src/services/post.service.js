"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePost = exports.UpdatePost = exports.findallPost = exports.findPost = exports.createPost = void 0;
const post__model_1 = __importDefault(require("../models/post. model"));
async function createPost(input) {
    try {
        const post = await post__model_1.default.create(input);
        if (post)
            return post;
        return false;
    }
    catch (err) {
        return false;
    }
}
exports.createPost = createPost;
async function findPost(query) {
    const post = await post__model_1.default.findOne(query).lean();
    if (post)
        return post;
    return false;
}
exports.findPost = findPost;
async function findallPost(query) {
    const post = await post__model_1.default.find(query).sort({ createdAt: -1 });
    if (post) {
        return post;
    }
    else {
        return false;
    }
}
exports.findallPost = findallPost;
async function UpdatePost(filterquery, updatequery) {
    try {
        post__model_1.default.updateOne(filterquery, updatequery).then((result) => {
            return result;
        })
            .catch((err) => {
            return err;
        });
    }
    catch (err) {
        return err;
    }
}
exports.UpdatePost = UpdatePost;
async function DeletePost(postId) {
    try {
        post__model_1.default.deleteOne({ _id: postId })
            .then(() => {
            return true;
        })
            .catch((err) => {
            return err;
        });
    }
    catch (err) {
        return err;
    }
}
exports.DeletePost = DeletePost;
