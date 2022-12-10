"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sentotpHandler = exports.verifyotpHandler = exports.adminLogin = exports.loginUserHandler = exports.createUserHandler = void 0;
const admin_service_1 = require("../services/admin.service");
const auth_service_1 = require("../services/auth.service");
const user_service_1 = require("../services/user.service");
const jwt_utils_1 = require("../utils/jwt.utils");
const serverSID = process.env.Twilio_ServerSID;
const accountSID = process.env.Twilio_AccountSID;
const authtoken = process.env.Twilio_Authtoken;
const client = require('twilio')(accountSID, authtoken);
/* ------------------------------- create user ------------------------------ */
async function createUserHandler(req, res) {
    try {
        let userexist = await (0, user_service_1.findUser)({ $or: [{ email: req.body.email }, { phone: req.body.phone }] });
        if (userexist) {
            res.json({ err: "user already exist" });
        }
        else {
            const user = await (0, auth_service_1.createUser)(req.body);
            res.json(user);
        }
    }
    catch (err) {
        res.status(409).json({ err: err.message });
    }
}
exports.createUserHandler = createUserHandler;
/* ------------------------------- login user ------------------------------- */
async function loginUserHandler(req, res) {
    let user = await (0, auth_service_1.loginUser)(req.body); //get users details
    if (!user) {
        res.status(200).json({ message: 'user not found' });
    }
    else {
        let userDetails = {
            _id: user._id,
            email: user.email,
            // isAdmin:user.isAdmin,
            profilePic: user.profilePic,
            followers: user?.followers,
            following: user?.following,
            notif: user?.notif,
            name: user.name
        };
        const accessToken = (0, jwt_utils_1.generateAccessToken)(userDetails);
        const refreshToken = (0, jwt_utils_1.generateRefreshToken)(userDetails);
        res.json({ accessToken, refreshToken, ...userDetails });
    }
}
exports.loginUserHandler = loginUserHandler;
async function adminLogin(req, res) {
    try {
        if (req.body.email && req.body.password) {
            const user = await (0, admin_service_1.LoginAdmin)(req.body);
            if (!user) {
                res.status(200).json({ message: 'user not found' });
            }
            else if (user.blocked) {
                res.status(200).json({ message: 'user is restricted ' });
            }
            else {
                let AdminDetails = {
                    _id: user._id,
                    email: user.email,
                    isAdmin: user.isAdmin,
                };
                const accessToken = (0, jwt_utils_1.generateAccessToken)(AdminDetails);
                const refreshToken = (0, jwt_utils_1.generateRefreshToken)(AdminDetails);
                res.json({ accessToken, refreshToken, ...AdminDetails });
            }
        }
        else {
            res.status(400).json("please fill all the credentials");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}
exports.adminLogin = adminLogin;
async function verifyotpHandler(req, res) {
    const { otp, phno } = req.body;
    client.verify
        .services(serverSID)
        .verificationChecks.create({ to: `+91${phno}`, code: otp })
        .then(async (resp) => {
        console.log(resp);
        if (!resp.valid) {
            res.json({ err: "invalid otp" });
        }
        else {
            let user = await (0, user_service_1.findUser)({ phone: req.body.phno }); //get users details
            console.log(user);
            if (!user) {
                res.status(200).json({ message: 'user not found' });
            }
            else {
                let userDetails = {
                    _id: user._id,
                    email: user.email,
                    // isAdmin:user.isAdmin,
                    profilePic: user.profilePic,
                    followers: user?.followers,
                    following: user?.following,
                    notif: user?.notif,
                    name: user.name
                };
                const accessToken = (0, jwt_utils_1.generateAccessToken)(userDetails);
                const refreshToken = (0, jwt_utils_1.generateRefreshToken)(userDetails);
                res.json({ accessToken, refreshToken, ...userDetails });
            }
        }
    }).catch((err) => {
        console.log(err);
        res.json({ err: "error happend in otp verify" });
    });
}
exports.verifyotpHandler = verifyotpHandler;
async function sentotpHandler(req, res) {
    try {
        console.log(req.body);
        const user = await (0, user_service_1.findUser)({ phone: req.body.phno });
        if (!user) {
            res.json({ err: "user not found register first" });
        }
        else {
            client.verify
                .services(serverSID)
                .verifications.create({
                to: `+91${req.body.phno}`,
                channel: 'sms',
            })
                .then((data) => {
                res.json('otp sent');
            })
                .catch((err) => {
                res.json({ err: "otp cannot be sent " });
            });
        }
    }
    catch (err) {
        res.json({ err: err });
    }
}
exports.sentotpHandler = sentotpHandler;
