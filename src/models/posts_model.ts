import mongoose, { Document, Schema, ObjectId } from "mongoose";

export interface IPostDocument extends Document {
  _id: ObjectId,
  content: string;
  sender: string;
}

const postSchema = new Schema<IPostDocument>({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model<IPostDocument>("Post", postSchema);

export default Post;