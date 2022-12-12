"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUser = exports.UpdateUser = exports.findallUser = exports.findUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
async function findUser(query) {
    try {
        return user_model_1.default.findOne(query).lean();
    }
    catch (err) {
        console.log(err);
    }
}
exports.findUser = findUser;
async function findallUser(query) {
    try {
        return user_model_1.default.find(query);
    }
    catch (err) {
        console.log(err);
        return err;
    }
}
exports.findallUser = findallUser;
async function UpdateUser(filterquery, updatequery) {
    try {
        let updatedUser = await user_model_1.default.findByIdAndUpdate(filterquery, updatequery);
        return updatedUser;
    }
    catch (err) {
        return false;
    }
}
exports.UpdateUser = UpdateUser;
async function DeleteUser(userId) {
    try {
        await user_model_1.default.deleteOne({ _id: userId });
        return true;
    }
    catch (err) {
        return err;
    }
}
exports.DeleteUser = DeleteUser;
