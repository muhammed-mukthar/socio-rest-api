import e, { Request, Response } from "express";
import PostModel from "../models/post. model";

import {
  createPost,
  DeletePost,
  findallPost,
  findPost,
  UpdatePost,
} from "../services/post.service";
import mongoose, { ObjectId } from "mongoose";
import { strict } from "assert";
import { findUser, UpdateUser } from "../services/user.service";
import { string } from "zod";
import { rmSync } from "fs";
import { createNotif, findNotif } from "../services/notif.service";

const objectid = mongoose.Types.ObjectId;

/* ------------------------------- create post ------------------------------ */

export async function createPostHandler(req: Request, res: Response) {
  try {
    //@ts-ignore
    const userId = req.user._id;

    const postbody = {
      ...req.body,
      userId: userId,
    };

    const newPost = await createPost(postbody);
    if (newPost) {
      res.json(newPost);
    } else {
      res.json("cannot create a post ");
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

/* ------------------------------- update post ------------------------------ */

export async function updatePostHandler(req: Request, res: Response) {
  try {
    const post = await findPost({ _id: req.params.id });

    //@ts-ignore
    if (post && post.userId == req.user._id) {
      const updatedPost = await UpdatePost(
        { _id: req.params.id },
        { $set: req.body }
      );
      res.status(200).json("post has been updated");
    } else {
      res.status(403).json("you can only update yours ");
    }
  } catch (err) {
    res.status(403).json(err);
  }
}

/* ------------------------------- delete post ------------------------------ */

export async function deletePostHandler(req: Request, res: Response) {
  try {
    const post = await findPost({ _id: req.params.id });

    if (!post) return res.status(301).json({ error: "invalid post post" });
    //@ts-ignore
    if (post.userId == req.user._id || req.user.isAdmin) {
      DeletePost(req.params.id)
        .then((e) => res.json("post deleted successfully"))
        .catch((e) => res.status(403).json(e));
    } else {
      res.status(403).json({ error: "you can only delete yours " });
    }
  } catch (err) {
    res.status(403).json({ error: err });
  }
}

//like post

export async function likeDislikeHandler(req: Request, res: Response) {
  try {
    const post = await findPost({ _id: req.params.id });

    //@ts-ignore
    const currentuser = await findUser({ _id: req.user._id })

    if (!post) return res.status(404).json("post not found");
    const user = await findUser({ _id: post.userId })
    const notif = await findNotif({ user: post.userId })
    //@ts-ignore
    if (!post.likes.includes(req.user._id)) {
      const checkUseralreadyliked = (obj: { post: any }) => obj.post == post._id;
      //@ts-ignore
      console.log(notif?.some(checkUseralreadyliked));
      // //@ts-ignore
      // console.log(user?._id, req.user?._id);
      // //@ts-ignore
      // console.log((user?._id) == req.user?._id, 'y');
      //@ts-ignore
      if (notif?.some(checkUseralreadyliked) || user?._id == req.user?._id) {
        await UpdatePost(
          { _id: req.params.id },
          //@ts-ignore
          { $push: { likes: req.user._id } }
        );
        res.json("The post has been liked");
      } else {
        const notif = {
          user: user?._id,
          name: currentuser?.name,
          sender:currentuser?._id,
          post: req.params.id,
          postPic: post?.img,
          message: `${currentuser?.name} liked your post `,

          profile: currentuser?.profilePic
        }

        await UpdatePost(
          { _id: req.params.id },
          //@ts-ignore
          { $push: { likes: req.user._id } }
        );
        await createNotif(notif)

        res.json("The post has been liked");
      }
    } else {
      await UpdatePost(
        { _id: req.params.id },
        //@ts-ignore
        { $pull: { likes: req.user._id } }
      );
      res.json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

//get post

export async function getsinglePostHandler(req: Request, res: Response) {
  try {
    const post = await findPost({ _id: req.params.id });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function userPostHandler(req: Request, res: Response) {
  try {
    // const user = await User.findOne({ username: req.params.username });

    const posts = await findallPost({ userId: req.params.id });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
}

//get timeline post

export async function timelinePostHandler(req: Request, res: Response) {
  try {
    let user: mongoose.Types.ObjectId;
    //@ts-ignore
    user = new objectid(req.user._id);
    const currentUser = await findUser({ _id: user });
    if (!currentUser || currentUser == null) return res.json("user not found");
    const userPosts = await findallPost({ userId: currentUser._id });
    if (!userPosts) return res.json("you have not posted");
    let friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return findallPost({ userId: friendId });
      })
    );

    friendPosts = friendPosts.filter((post) => {
      return post != false;
    });

    //@ts-ignore
    res.json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function createcommentHandler(req: Request, res: Response) {
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
    const post = await findPost({ _id: req.params.id });
    if (post) {
      await UpdatePost(
        { _id: req.params.id },
        //@ts-ignore
        { $push: { comments: comments } }
      );

      res.json("comment created successfully");
    } else {
      res.json(401).json("post not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function deletecommentHandler(req: Request, res: Response) {
  try {
    await UpdatePost(
      { _id: req.params.id },
      //@ts-ignore
      { $pull: { comments: { _id: req.body.commentId } } }
    );
    res.json("comment deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function allPostsHandler(req: Request, res: Response) {
  try {
    // const user = await User.findOne({ username: req.params.username });
    const posts = await PostModel.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function ReportPostHandler(req: Request, res: Response) {
  try {
    console.log("i am here");

    const postExist = await findPost({ _id: req.params.id });
    console.log(postExist);
    if (postExist) {
      await UpdatePost(
        {
          _id: req.params.id,
        },
        { $push: { reports: req.body } }
      );
      console.log("i have reported user ");

      res.json({ message: "post reported" });
    } else {
      res.status(500).json({ err: "post not found" });
    }
  } catch (err) {
    res.status(500).json({ err: err });
  }
}
