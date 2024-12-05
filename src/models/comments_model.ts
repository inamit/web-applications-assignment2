import mongoose, { Document, Schema, Types, ObjectId } from "mongoose";

export interface CommentDocument extends Document {
  _id: ObjectId,
  postID: Types.ObjectId;
  content: string;
  sender: string;
}

const commentSchema = new Schema<CommentDocument>({
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model<CommentDocument>("Comment", commentSchema);

export default Comment;