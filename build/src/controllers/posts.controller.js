"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportPostHandler = exports.allPostsHandler = exports.deletecommentHandler = exports.createcommentHandler = exports.timelinePostHandler = exports.userPostHandler = exports.getsinglePostHandler = exports.likeDislikeHandler = exports.deletePostHandler = exports.updatePostHandler = exports.createPostHandler = void 0;
const post__model_1 = __importDefault(require("../models/post. model"));
const post_service_1 = require("../services/post.service");
const mongoose_1 = __importDefault(require("mongoose"));
const user_service_1 = require("../services/user.service");
const notif_service_1 = require("../services/notif.service");
const objectid = mongoose_1.default.Types.ObjectId;
/* ------------------------------- create post ------------------------------ */
async function createPostHandler(req, res) {
    try {
        //@ts-ignore
        const userId = req.user._id;
        const postbody = {
            ...req.body,
            userId: userId,
        };
        const newPost = await (0, post_service_1.createPost)(postbody);
        if (newPost) {
            res.json(newPost);
        }
        else {
            res.json("cannot create a post ");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}
exports.createPostHandler = createPostHandler;
/* ------------------------------- update post ------------------------------ */
async function updatePostHandler(req, res) {
    try {
        const post = await (0, post_service_1.findPost)({ _id: req.params.id });
        //@ts-ignore
        if (post && post.userId == req.user._id) {
            const updatedPost = await (0, post_service_1.UpdatePost)({ _id: req.params.id }, { $set: req.body });
            res.status(200).json("post has been updated");
        }
        else {
            res.status(403).json("you can only update yours ");
        }
    }
    catch (err) {
        res.status(403).json(err);
    }
}
exports.updatePostHandler = updatePostHandler;
/* ------------------------------- delete post ------------------------------ */
async function deletePostHandler(req, res) {
    try {
        const post = await (0, post_service_1.findPost)({ _id: req.params.id });
        if (!post)
            return res.status(301).json({ error: "invalid post post" });
        //@ts-ignore
        if (post.userId == req.user._id || req.user.isAdmin) {
            (0, post_service_1.DeletePost)(req.params.id)
                .then((e) => res.json("post deleted successfully"))
                .catch((e) => res.status(403).json(e));
        }
        else {
            res.status(403).json({ error: "you can only delete yours " });
        }
    }
    catch (err) {
        res.status(403).json({ error: err });
    }
}
exports.deletePostHandler = deletePostHandler;
//like post
async function likeDislikeHandler(req, res) {
    try {
        const post = await (0, post_service_1.findPost)({ _id: req.params.id });
        //@ts-ignore
        const currentuser = await (0, user_service_1.findUser)({ _id: req.user._id });
        if (!post)
            return res.status(404).json("post not found");
        const user = await (0, user_service_1.findUser)({ _id: post.userId });
        const notif = await (0, notif_service_1.findNotif)({ user: post.userId });
        //@ts-ignore
        if (!post.likes.includes(req.user._id)) {
            const checkUseralreadyliked = (obj) => obj.post == post._id;
            //@ts-ignore
            console.log(notif?.some(checkUseralreadyliked));
            // //@ts-ignore
            // console.log(user?._id, req.user?._id);
            // //@ts-ignore
            // console.log((user?._id) == req.user?._id, 'y');
            //@ts-ignore
            if (notif?.some(checkUseralreadyliked) || user?._id == req.user?._id) {
                await (0, post_service_1.UpdatePost)({ _id: req.params.id }, 
                //@ts-ignore
                { $push: { likes: req.user._id } });
                res.json("The post has been liked");
            }
            else {
                const notif = {
                    user: user?._id,
                    name: currentuser?.name,
                    sender: currentuser?._id,
                    post: req.params.id,
                    postPic: post?.img,
                    message: `${currentuser?.name} liked your post `,
                    profile: currentuser?.profilePic
                };
                await (0, post_service_1.UpdatePost)({ _id: req.params.id }, 
                //@ts-ignore
                { $push: { likes: req.user._id } });
                await (0, notif_service_1.createNotif)(notif);
                res.json("The post has been liked");
            }
        }
        else {
            await (0, post_service_1.UpdatePost)({ _id: req.params.id }, 
            //@ts-ignore
            { $pull: { likes: req.user._id } });
            res.json("The post has been disliked");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}
exports.likeDislikeHandler = likeDislikeHandler;
//get post
async function getsinglePostHandler(req, res) {
    try {
        const post = await (0, post_service_1.findPost)({ _id: req.params.id });
        res.status(200).json(post);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
exports.getsinglePostHandler = getsinglePostHandler;
async function userPostHandler(req, res) {
    try {
        // const user = await User.findOne({ username: req.params.username });
        const posts = await (0, post_service_1.findallPost)({ userId: req.params.id });
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
exports.userPostHandler = userPostHandler;
//get timeline post
async function timelinePostHandler(req, res) {
    try {
        let user;
        //@ts-ignore
        user = new objectid(req.user._id);
        const currentUser = await (0, user_service_1.findUser)({ _id: user });
        if (!currentUser || currentUser == null)
            return res.json("user not found");
        const userPosts = await (0, post_service_1.findallPost)({ userId: currentUser._id });
        if (!userPosts)
            return res.json("you have not posted");
        let friendPosts = await Promise.all(currentUser.following.map((friendId) => {
            return (0, post_service_1.findallPost)({ userId: friendId });
        }));
        friendPosts = friendPosts.filter((post) => {
            return post != false;
        });
        //@ts-ignore
        res.json(userPosts.concat(...friendPosts));
    }
    catch (err) {
        res.status(500).json(err);
    }
}
exports.timelinePostHandler = timelinePostHandler;
async function createcommentHandler(req, res) {
    try {
        const comments = {
            //@ts-ignore
            user: req.user._id,
            //@ts-ignore
            name: req.body.name,
            comment: req.body.comments,
            //@ts-ignore
            profile: req.body.profile,
        };
        const post = await (0, post_service_1.findPost)({ _id: req.params.id });
        if (post) {
            await (0, post_service_1.UpdatePost)({ _id: req.params.id }, 
            //@ts-ignore
            { $push: { comments: comments } });
            res.json("comment created successfully");
        }
        else {
            res.json(401).json("post not found");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}
exports.createcommentHandler = createcommentHandler;
async function deletecommentHandler(req, res) {
    try {
        await (0, post_service_1.UpdatePost)({ _id: req.params.id }, 
        //@ts-ignore
        { $pull: { comments: { _id: req.body.commentId } } });
        res.json("comment deleted successfully");
    }
    catch (err) {
        res.status(500).json(err);
    }
}
exports.deletecommentHandler = deletecommentHandler;
async function allPostsHandler(req, res) {
    try {
        // const user = await User.findOne({ username: req.params.username });
        const posts = await post__model_1.default.find();
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
exports.allPostsHandler = allPostsHandler;
async function ReportPostHandler(req, res) {
    try {
        console.log("i am here");
        const postExist = await (0, post_service_1.findPost)({ _id: req.params.id });
        console.log(postExist);
        if (postExist) {
            await (0, post_service_1.UpdatePost)({
                _id: req.params.id,
            }, { $push: { reports: req.body } });
            console.log("i have reported user ");
            res.json({ message: "post reported" });
        }
        else {
            res.status(500).json({ err: "post not found" });
        }
    }
    catch (err) {
        res.status(500).json({ err: err });
    }
}
exports.ReportPostHandler = ReportPostHandler;
