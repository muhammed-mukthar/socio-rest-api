import { FilterQuery, ObjectId, UpdateQuery } from "mongoose";
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
  return PostModel.findOne(query).lean();
}

export async function UpdatePost(
  filterquery: FilterQuery<PostDocument>,
  updatequery: UpdateQuery<PostDocument>
) {
  try {
    console.log(filterquery, updatequery);

      PostModel.findByIdAndUpdate(
      filterquery,
      updatequery
    ).then((result) => {
      return result ;
    })
    .catch((err) => {
      return err;
    });
  } catch (err) {
    return err;
  }
}

export async function DeletePost(postId: any) {
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
