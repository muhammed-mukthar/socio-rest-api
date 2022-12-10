"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const dotenv_1 = __importDefault(require("dotenv"));
const connect_1 = __importDefault(require("./utils/connect"));
const posts_1 = __importDefault(require("./routes/posts"));
const users_1 = __importDefault(require("./routes/users"));
const conversation_1 = __importDefault(require("./routes/conversation"));
const message_1 = __importDefault(require("./routes/message"));
const auth_1 = __importDefault(require("./routes/auth"));
const upload_1 = __importDefault(require("./routes/upload"));
const notification_1 = __importDefault(require("./routes/notification"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = config_1.default.get("port");
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
//   app.use((req:Request, res:Response, next:NextFunction) => {
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
//   });
//@ts-ignore
app.use((0, cors_1.default)({ origin: process.env.CORS_VARS.split(", ") }));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('common'));
app.use((0, cors_1.default)());
app.use('/api/posts', posts_1.default);
app.use('/api/users', users_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/conversation', conversation_1.default);
app.use('/api/message', message_1.default);
app.use('/api/uploads', upload_1.default);
app.use('/api/notif', notification_1.default);
app.listen(port, async () => {
    console.log('app is running on port 5000');
    (0, connect_1.default)();
});
