"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const posts_controller_1 = require("../controllers/posts.controller");
const jwtvalidate_1 = require("../middleware/jwtvalidate");
const router = express_1.default.Router();
router.post("/", jwtvalidate_1.VerifyTokenAndReissue, posts_controller_1.createPostHandler); //create a post
router
    .route("/:id")
    .get(jwtvalidate_1.VerifyTokenAndReissue, posts_controller_1.getsinglePostHandler) //get a post
    .put(jwtvalidate_1.VerifyTokenAndReissue, posts_controller_1.updatePostHandler) //update a post
    .delete(jwtvalidate_1.VerifyTokenAndReissue, posts_controller_1.deletePostHandler); //delete a post
//like dislike a post
router.put("/:id/like", jwtvalidate_1.VerifyTokenAndReissue, posts_controller_1.likeDislikeHandler);
//get timeline posts
router.get('/timeline/all', jwtvalidate_1.VerifyTokenAndReissue, posts_controller_1.timelinePostHandler);
//user's post 
router.get("/profile/:id", jwtvalidate_1.VerifyTokenAndReissue, posts_controller_1.userPostHandler);
//create comment
router.put('/:id/comment', jwtvalidate_1.VerifyTokenAndReissue, posts_controller_1.createcommentHandler);
//edi comment
router.put('/:id/uncomment', jwtvalidate_1.VerifyTokenAndReissue, posts_controller_1.deletecommentHandler);
router.put('/:id/report', jwtvalidate_1.VerifyTokenAndReissue, posts_controller_1.ReportPostHandler);
//all posts
router.get("/", jwtvalidate_1.verifyAdmin, posts_controller_1.allPostsHandler);
exports.default = router;
