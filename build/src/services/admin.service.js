"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginAdmin = void 0;
const admin_model_1 = __importDefault(require("../models/admin.model"));
const lodash_1 = require("lodash");
/* ------------------------------- find adnin ------------------------------ */
async function LoginAdmin({ email, password, }) {
    try {
        const user = await admin_model_1.default.findOne({ email });
        if (!user) {
            return false;
        }
        const isValid = await user.comparePassword(password);
        console.log(isValid, 'is valid checking');
        if (!isValid)
            return false;
        return (0, lodash_1.omit)(user.toJSON(), "password");
    }
    catch (err) {
        console.log(err);
    }
}
exports.LoginAdmin = LoginAdmin;
