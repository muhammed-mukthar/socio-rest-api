"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const accessTokenSecret = config_1.default.get('accessTokenSecret');
const accessTokentime = config_1.default.get('accessTokenTtl');
const refreshTokenSecret = config_1.default.get('refreshTokenSecret');
const refreshTokenTime = config_1.default.get('refreshTokenTtl');
function generateAccessToken(user) {
    return jsonwebtoken_1.default.sign({ ...user }, accessTokenSecret, {
        expiresIn: accessTokentime,
    });
}
exports.generateAccessToken = generateAccessToken;
;
function generateRefreshToken(user) {
    return jsonwebtoken_1.default.sign({ ...user }, refreshTokenSecret, {
        expiresIn: refreshTokenTime
    });
}
exports.generateRefreshToken = generateRefreshToken;
;
function verifyJwt(token, keyName) {
    const publicKey = config_1.default.get(keyName);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, publicKey);
        if (decoded) {
            return {
                valid: true,
                expired: false,
                decoded,
            };
        }
        else {
            return {
                valid: false,
                expired: "invalid accessToken",
                decoded: null,
            };
        }
    }
    catch (e) {
        return {
            valid: false,
            expired: e.message === "jwt expired",
            decoded: null,
        };
    }
}
exports.verifyJwt = verifyJwt;
