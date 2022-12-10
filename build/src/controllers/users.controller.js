"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowingsHandler = exports.getFollowersHandler = exports.filterHandler = exports.getFriendsHandler = exports.unblockHandler = exports.blockUserHandler = exports.getAllUsersHandler = exports.unfollowHandler = exports.followHandler = exports.getUserHandler = exports.deleteUserHandler = exports.updateUserHandler = void 0;
const lodash_1 = require("lodash");
const user_model_1 = __importDefault(require("../models/user.model"));
const notif_service_1 = require("../services/notif.service");
const user_service_1 = require("../services/user.service");
const hashpass_1 = __importDefault(require("../utils/hashpass"));
/* ------------------------------- update user ------------------------------ */
async function updateUserHandler(req, res) {
    //@ts-ignore
    if (req.user._id === req.params.id) {
        // if (req.body.userId === req.params.id ) {
        try {
            if (req.body.password) {
                req.body.password = await (0, hashpass_1.default)(req.body.password);
            }
            await (0, user_service_1.UpdateUser)({ _id: req.params.id }, { $set: req.body });
            res.status(200).json("Account has been updated");
        }
        catch (error) {
            return res.status(403).json("you can only update your account");
        }
    }
    else {
        res.status(403).json('you can only update your account');
    }
}
exports.updateUserHandler = updateUserHandler;
/* ------------------------------- delete user ------------------------------ */
async function deleteUserHandler(req, res) {
    // @ts-ignore
    if (req.user._id === req.params.id || req.user.isAdmin) {
        try {
            (0, user_service_1.DeleteUser)(req.params.id).then(() => res.status(200).json("Account has been Deleted"))
                .catch(() => res.status(403).json("error happend while deleting"));
        }
        catch (error) {
            return res.status(403).json("you can only update your account");
        }
    }
    else {
        res.status(301).json('you are not permitted to do that');
    }
}
exports.deleteUserHandler = deleteUserHandler;
/* ------------------------------- get a user ------------------------------- */
async function getUserHandler(req, res) {
    try {
        const user = await (0, user_service_1.findUser)({ _id: req.params.id });
        res.status(200).json((0, lodash_1.omit)(user, 'password'));
    }
    catch (err) {
        res.status(500).json(err);
    }
}
exports.getUserHandler = getUserHandler;
/* ------------------------------ follow a user ----------------------------- */
async function followHandler(req, res) {
    if (req.user._id !== req.params.id) {
        try {
            const user = await (0, user_service_1.findUser)({ _id: req.params.id });
            const currentuser = await (0, user_service_1.findUser)({ _id: req.user._id });
            const notif = await (0, notif_service_1.findNotif)({ user: req.params.id });
            console.log(notif);
            if (currentuser && notif) {
                const checkUseralreadyfollow = (obj) => obj.user == currentuser._id;
                console.log(notif.some(checkUseralreadyfollow));
                if (notif.some(checkUseralreadyfollow)) {
                    await (0, user_service_1.UpdateUser)({ _id: req.params.id }, { $push: { followers: req.user._id } });
                    await (0, user_service_1.UpdateUser)({ _id: req.user._id }, { $push: { following: req.params.id } });
                    res.json('user has been followed');
                }
                else {
                    const notif = {
                        user: user?._id,
                        sender: currentuser._id,
                        name: currentuser.name,
                        message: `${currentuser.name} started following you`,
                        profile: currentuser.profilePic
                    };
                    //@ts-ignore
                    if (!user?.followers.includes(req.user._id)) {
                        await (0, notif_service_1.createNotif)(notif);
                        await (0, user_service_1.UpdateUser)({ _id: req.params.id }, { $push: { followers: req.user._id } });
                        await (0, user_service_1.UpdateUser)({ _id: req.user._id }, { $push: { following: req.params.id } });
                        res.json('user has been followed');
                    }
                    else {
                        res.status(403).json('you already follow this user');
                    }
                }
            }
            else {
                res.status(403).json('current user cannot be found');
            }
        }
        catch (err) {
            console.log(err, 'error');
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json('you cant follow yourself');
    }
}
exports.followHandler = followHandler;
/* ------------------------------ unfollow user ----------------------------- */
async function unfollowHandler(req, res) {
    //@ts-ignore
    if (req.user._id !== req.params.id) {
        try {
            const user = await (0, user_service_1.findUser)({ _id: req.params.id });
            //@ts-ignore
            const currentUser = await (0, user_service_1.findUser)({ _id: req.user._id });
            //@ts-ignore
            if (user?.followers.includes(req.user._id)) {
                //@ts-ignore
                await (0, user_service_1.UpdateUser)({ _id: req.params.id }, { $pull: { followers: req.user._id } });
                //@ts-ignore
                await (0, user_service_1.UpdateUser)({ _id: req.user._id }, { $pull: { following: req.params.id } });
                res.json('user has been unfollowed');
            }
            else {
                res.status(403).json('you havent followed this user');
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json('you cant unfollow yourself');
    }
}
exports.unfollowHandler = unfollowHandler;
//get all user
async function getAllUsersHandler(req, res) {
    try {
        //@ts-ignore
        const userId = req.user._id;
        const suggestedUser = await (0, user_service_1.findallUser)({ followers: { $nin: [userId] } });
        res.json(suggestedUser);
    }
    catch (err) {
        res.json(500).json({ error: err });
    }
}
exports.getAllUsersHandler = getAllUsersHandler;
async function blockUserHandler(req, res) {
    try {
        await user_model_1.default.findByIdAndUpdate(req.params.id, {
            $set: { blocked: true },
        });
        res.status(200).json("Account blocked successfully");
    }
    catch (err) {
        return res.status(500).json(err);
    }
}
exports.blockUserHandler = blockUserHandler;
async function unblockHandler(req, res) {
    try {
        await user_model_1.default.findByIdAndUpdate(req.params.id, {
            $set: { blocked: false },
        });
        res.status(200).json("Account unblocked successfully");
    }
    catch (err) {
        return res.status(500).json(err);
    }
}
exports.unblockHandler = unblockHandler;
async function getFriendsHandler(req, res) {
    try {
        //@ts-ignore
        const user = await user_model_1.default.findById(req.params.userId);
        console.log(user, 'user here');
        const friends = await Promise.all(
        //@ts-ignore
        user.following.map((friendId) => {
            return user_model_1.default.findById(friendId);
        }));
        let friendList = [];
        friends.map((friend) => {
            if (friend != null) {
                const { _id, name, profilePic } = friend;
                friendList.push({ _id, name, profilePic });
            }
        });
        res.status(200).json(friendList);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
        console.log(err);
    }
}
exports.getFriendsHandler = getFriendsHandler;
async function filterHandler(req, res) {
    try {
        console.log('i am here');
        var search = '';
        if (req.body.search) {
            search = req.body.search;
        }
        // console.log(req.query);
        let userdetails = await (0, user_service_1.findallUser)({ $or: [
                {
                    name: { $regex: '.*' + search + '.*', $options: 'i' }
                }
            ] });
        console.log(userdetails);
        res.json(userdetails);
    }
    catch (err) {
        res.status(500).json('some error happpened in searching');
    }
}
exports.filterHandler = filterHandler;
async function getFollowersHandler(req, res) {
    try {
        (0, user_service_1.findUser)({ _id: req.params.id })
            .then(async (currentUser) => {
            if (!currentUser)
                return res.status(403).json('errpr happened user not found');
            console.log(currentUser);
            const followers = await Promise.all(currentUser.followers.map((followerId) => {
                return (0, user_service_1.findUser)({ _id: followerId });
            }));
            res.status(200).json(followers);
        })
            .catch((error) => res.status(500).json(error));
    }
    catch (err) {
        res.status(500).json('error happend ');
    }
}
exports.getFollowersHandler = getFollowersHandler;
async function getFollowingsHandler(req, res) {
    try {
        (0, user_service_1.findUser)({ _id: req.params.id })
            .then(async (currentUser) => {
            if (!currentUser)
                return res.status(403).json('errpr happened user not found');
            console.log(currentUser);
            const followings = await Promise.all(currentUser.following.map((followingId) => {
                return (0, user_service_1.findUser)({ _id: followingId });
            }));
            res.status(200).json(followings);
        })
            .catch((error) => res.status(500).json(error));
    }
    catch (err) {
        res.status(500).json(err);
    }
}
exports.getFollowingsHandler = getFollowingsHandler;
