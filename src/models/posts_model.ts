import mongoose, { Document, Schema, ObjectId } from "mongoose";

export interface PostDocument extends Document {
  _id: ObjectId,
  content: string;
  sender: string;
}

const postSchema = new Schema<PostDocument>({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model<PostDocument>("Post", postSchema);

export default Post;