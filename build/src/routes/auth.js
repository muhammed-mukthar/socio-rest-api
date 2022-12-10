"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const validateResource_1 = __importDefault(require("../middleware/validateResource"));
const users_schema_1 = require("../schema/users.schema");
const serverSID = process.env.Twilio_ServerSID;
const accountSID = process.env.Twilio_AccountSID;
const authtoken = process.env.Twilio_Authtoken;
const client = require('twilio')(accountSID, authtoken);
const router = express_1.default.Router();
/* -------------------------------- Register -------------------------------- */
router.post('/register', (0, validateResource_1.default)(users_schema_1.createUserSchema), auth_controller_1.createUserHandler);
/* ---------------------------------- login --------------------------------- */
router.post('/login', (0, validateResource_1.default)(users_schema_1.loginUserSchema), auth_controller_1.loginUserHandler);
//admin login
router.post("/admin-login", auth_controller_1.adminLogin);
router.post('/sendotp', auth_controller_1.sentotpHandler);
router.post('/otplogin', auth_controller_1.verifyotpHandler);
exports.default = router;
