"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
const UserSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "https://vectorified.com/images/default-profile-picture-icon-3.png" },
    coverPic: { type: String, default: "https://images.fastcompany.net/image/upload/w_596,c_limit,q_auto:best,f_auto/wp-cms/uploads/2021/03/LinkedIn-Default-Background-2020-.jpg" },
    profilekey: { type: String },
    coverkey: { type: String, },
    followers: {
        type: Array,
        default: [],
    },
    phone: {
        type: Number,
    },
    following: {
        type: Array,
        default: [],
    },
    desc: {
        type: String,
        max: 50,
    },
    city: {
        type: String,
        max: 50,
    }, blocked: {
        type: Boolean,
        default: false,
    }, notif: [{ type: new mongoose_1.default.Schema({
                user: { type: String },
                name: { type: String },
                profile: { type: String },
                post: { type: String },
                postPic: { type: String },
                message: { type: String }
            }, { timestamps: true }) }],
    relationship: {
        type: Number,
        enum: [1, 2, 3],
    },
}, {
    timestamps: true,
});
/* -------------------- saving hash password using bcrypt ------------------- */
UserSchema.pre("save", async function (next) {
    let user = this;
    if (!user.isModified("password")) {
        return next();
    }
    const salt = await bcrypt_1.default.genSalt(config_1.default.get("saltlength"));
    const hash = await bcrypt_1.default.hashSync(user.password, salt);
    user.password = hash;
    return next();
});
/* ---------------------------- compare password ---------------------------- */
UserSchema.methods.comparePassword = async function (passwordInput) {
    const user = this;
    return bcrypt_1.default.compare(passwordInput, user.password).catch((e) => false);
};
const UserModel = mongoose_1.default.model("User", UserSchema);
exports.default = UserModel;
