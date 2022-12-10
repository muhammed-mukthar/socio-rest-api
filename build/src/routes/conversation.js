"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coversationController_1 = require("../controllers/coversationController");
const router = express_1.default.Router();
router.post('/', coversationController_1.createChat);
router.get('/:userId', coversationController_1.userChats);
router.get('/find/:firstId/:secondId', coversationController_1.findChat);
exports.default = router;
