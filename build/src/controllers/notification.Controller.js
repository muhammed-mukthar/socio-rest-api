"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationHandler = exports.updateNotfiHandler = exports.getallNotfiHandler = void 0;
const notif_service_1 = require("../services/notif.service");
const user_service_1 = require("../services/user.service");
async function getallNotfiHandler(req, res) {
    try {
        const allnotif = await (0, notif_service_1.findNotif)({ user: req.params.id });
        if (allnotif) {
            res.json(allnotif);
        }
        else {
            res.json({ err: "no user here" });
        }
    }
    catch (error) {
        res.status(500).json({ err: error });
    }
}
exports.getallNotfiHandler = getallNotfiHandler;
async function updateNotfiHandler(req, res) {
    try {
        (0, notif_service_1.updateNotif)({ user: req.params.id, isVisited: false }, {
            $set: {
                isVisited: true
            }
        }).then((response) => {
            res.status(200).json(response);
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}
exports.updateNotfiHandler = updateNotfiHandler;
async function createNotificationHandler(req, res) {
    try {
        let { senderId, recieverId } = req.body;
        const currentuser = await (0, user_service_1.findUser)({ _id: senderId });
        const notif = {
            user: recieverId,
            name: currentuser?.name,
            sender: currentuser?._id,
            message: `${currentuser?.name} sent a message  `,
            profile: currentuser?.profilePic
        };
        await (0, notif_service_1.createNotif)(notif);
        if (notif) {
            res.json(notif);
        }
        else {
            res.json({ err: "notification error" });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}
exports.createNotificationHandler = createNotificationHandler;
