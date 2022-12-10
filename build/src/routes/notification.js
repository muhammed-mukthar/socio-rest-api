"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_Controller_1 = require("../controllers/notification.Controller");
const jwtvalidate_1 = require("../middleware/jwtvalidate");
const router = express_1.default.Router();
router.get('/:id', jwtvalidate_1.VerifyTokenAndReissue, notification_Controller_1.getallNotfiHandler),
    router.put("/:id", jwtvalidate_1.VerifyTokenAndReissue, notification_Controller_1.updateNotfiHandler);
exports.default = router;
