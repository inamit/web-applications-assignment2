import mongoose, { Document, Schema, ObjectId } from "mongoose";

export interface ICommentDocument extends Document {
  _id: ObjectId,
  postID: ObjectId;
  content: string;
  sender: string;
}

const commentSchema = new Schema<ICommentDocument>({
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

const Comment = mongoose.model<ICommentDocument>("Comment", commentSchema);

export default Comment;