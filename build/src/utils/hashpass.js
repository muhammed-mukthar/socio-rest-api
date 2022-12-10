"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
const createHashedPass = async function (passwordInput) {
    const salt = await bcrypt_1.default.genSalt(config_1.default.get("saltlength"));
    const hash = await bcrypt_1.default.hashSync(passwordInput, salt);
    return hash;
};
exports.default = createHashedPass;
