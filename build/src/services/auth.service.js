"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reIssueAccessToken = exports.loginUser = exports.createUser = void 0;
const lodash_1 = require("lodash");
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_utils_1 = require("../utils/jwt.utils");
const user_service_1 = require("./user.service");
/* ------------------------------- create user ------------------------------ */
async function createUser(input) {
    try {
        const user = await user_model_1.default.create(input);
        return (0, lodash_1.omit)(user.toJSON(), "password");
    }
    catch (err) {
        return err;
    }
}
exports.createUser = createUser;
async function loginUser({ email, password, }) {
    try {
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return false;
        }
        const isValid = await user.comparePassword(password);
        if (!isValid)
            return false;
        return (0, lodash_1.omit)(user.toJSON(), "password");
    }
    catch (err) {
        return false;
    }
}
exports.loginUser = loginUser;
async function reIssueAccessToken({ refreshToken, }) {
    const { decoded } = (0, jwt_utils_1.verifyJwt)(refreshToken, 'refreshTokenSecret');
    if (!decoded)
        return false;
    //@ts-ignore
    const user = await (0, user_service_1.findUser)({ _id: decoded.id });
    if (!user)
        return false;
    let userDetails = {
        id: user._id,
        email: user.email,
    };
    const accessToken = (0, jwt_utils_1.generateAccessToken)(userDetails);
    return accessToken;
}
exports.reIssueAccessToken = reIssueAccessToken;
