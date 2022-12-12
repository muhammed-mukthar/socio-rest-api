"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
async function connect() {
    const dbUri = config_1.default.get('dbUrl');
    try {
        await mongoose_1.default.connect(dbUri)
            .then(() => console.log('connected to db'));
    }
    catch (err) {
        console.error('err in mongoose connect');
        process.exit(1);
    }
}
exports.default = connect;
