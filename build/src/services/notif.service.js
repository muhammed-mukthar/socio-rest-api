"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotif = exports.createNotif = exports.findNotif = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
async function findNotif(query) {
    const notif = await notification_model_1.default.find(query).sort({ createdAt: -1 });
    if (notif) {
        return notif;
    }
    else {
        return false;
    }
}
exports.findNotif = findNotif;
async function createNotif(input) {
    try {
        const notif = await notification_model_1.default.create(input);
        if (notif)
            return notif;
        return false;
    }
    catch (err) {
        return false;
    }
}
exports.createNotif = createNotif;
async function updateNotif(filterquery, updatequery) {
    try {
        const notif = notification_model_1.default.updateMany(filterquery, updatequery);
        if (notif)
            return notif;
        return false;
    }
    catch (err) {
        return false;
    }
}
exports.updateNotif = updateNotif;
