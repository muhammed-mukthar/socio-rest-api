import mongoose, { FilterQuery, ObjectId, UpdateQuery } from "mongoose";
import PostModel, { PostDocument, postinput } from "../models/post. model";

export async function createPost(input: postinput) {
  try {
    const post = await PostModel.create(input);
    if (post) return post;
    return false;
  } catch (err) {
    return false;
  }
}

export async function findPost(query: FilterQuery<PostDocument>) {
  const post = await PostModel.findOne(query).lean();
  if (post) return post
  return false
}
export async function findallPost(query: FilterQuery<PostDocument>) {
  const post = await PostModel.find(query).sort({ createdAt: -1 })


  if (post) {
    return post
  } else {
    return false
  }

}

export async function UpdatePost(
  filterquery: FilterQuery<PostDocument>,
  updatequery: UpdateQuery<PostDocument>
) {
  try {


    PostModel.updateOne(
      filterquery,
      updatequery
    ).then((result) => {
      return result;
    })
      .catch((err) => {
        return err;
      });
  } catch (err) {
    return err;
  }
}

export async function DeletePost(postId: string) {
  try {
    PostModel.deleteOne({ _id: postId })
      .then(() => {
        return true;
      })
      .catch((err) => {
        return err;
      });
  } catch (err) {
    return err;
  }
}


