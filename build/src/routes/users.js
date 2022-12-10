"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("../controllers/users.controller");
const jwtvalidate_1 = require("../middleware/jwtvalidate");
const router = express_1.default.Router();
router.get('/suggestedusers', jwtvalidate_1.VerifyTokenAndReissue, users_controller_1.getAllUsersHandler);
router.route('/:id')
    .put(jwtvalidate_1.VerifyTokenAndReissue, users_controller_1.updateUserHandler) //update user
    .delete(jwtvalidate_1.VerifyTokenAndReissue, users_controller_1.deleteUserHandler) //delete user
    .get(jwtvalidate_1.VerifyTokenAndReissue, users_controller_1.getUserHandler); //get user
/* ------------------------------ follow a user ----------------------------- */
//@ts-ignore
router.put('/:id/follow', jwtvalidate_1.VerifyTokenAndReissue, users_controller_1.followHandler);
/* ----------------------------- unfollow a user ---------------------------- */
router.put('/:id/unfollow', jwtvalidate_1.VerifyTokenAndReissue, users_controller_1.unfollowHandler);
//block user
router.put("/block/:id", jwtvalidate_1.verifyAdmin, users_controller_1.blockUserHandler);
//unblock user
router.put("/unblock/:id", jwtvalidate_1.verifyAdmin, users_controller_1.unblockHandler);
//filter User
router.post('/filteruser', jwtvalidate_1.verifyTokenAndAuthorization, users_controller_1.filterHandler);
//get friends
router.get("/friends/:userId", jwtvalidate_1.VerifyTokenAndReissue, users_controller_1.getFriendsHandler);
//followers list
router.get('/followers/:id', jwtvalidate_1.VerifyTokenAndReissue, users_controller_1.getFollowersHandler);
//followings list
router.get('/followings/:id', jwtvalidate_1.VerifyTokenAndReissue, users_controller_1.getFollowingsHandler);
exports.default = router;
