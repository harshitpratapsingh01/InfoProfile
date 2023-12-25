"use strict"
import mongoose, { Schema, Document, model, Model } from 'mongoose';
import { DB_MODEL_REF } from '../../config';

// Post Model
interface PostAttributes extends Document {
    userId: mongoose.Types.ObjectId,
    url: string,
    caption?: string,
    likeCount: number,
    commentCount: number,
    postStatus: boolean 
}

const postSchema: Schema = new mongoose.Schema(
    {
        userId: {type: mongoose.Schema.ObjectId, required: true, ref: DB_MODEL_REF.USER},
        url: {type: String, required: true},
        caption: { type: String, required: false },
        likeCount: {type: Number, required: true, default: 0},
        commentCount: {type: Number, required: true, default: 0},
        postStatus: { type: Boolean, required: true, default: true },
    },
    { timestamps: true }
);

export const posts: Model<PostAttributes> = model<PostAttributes>(DB_MODEL_REF.POST, postSchema);

//Like Model
interface likeAttributes extends Document {
    userId: mongoose.Types.ObjectId,
    postId: mongoose.Types.ObjectId,
    likeStatus?: boolean 
}

const likeSchema: Schema = new mongoose.Schema(
    {
        userId: {type: mongoose.Schema.ObjectId, required: true, ref: DB_MODEL_REF.USER},
        postId: {type: mongoose.Schema.ObjectId, required: true, ref: DB_MODEL_REF.POST},
        likeStatus: { type: Boolean, required: true, default: true },
    },
    { timestamps: true }
);

export const likes: Model<likeAttributes> = model<likeAttributes>(DB_MODEL_REF.LIKE, likeSchema);

//Comment Model
interface commentAttributes extends Document {
    userId: mongoose.Types.ObjectId,
    postId: mongoose.Types.ObjectId,
    comment: string,
    commentStatus?: boolean 
}

const commentSchema: Schema = new mongoose.Schema(
    {
        userId: {type: mongoose.Schema.ObjectId, required: true, ref: DB_MODEL_REF.USER},
        postId: {type: mongoose.Schema.ObjectId, required: true, ref: DB_MODEL_REF.POST},
        comment: {type: String, required: true},
        commentStatus: { type: Boolean, required: true, default: true },
    },
    { timestamps: true }
);

export const comments: Model<commentAttributes> = model<commentAttributes>(DB_MODEL_REF.COMMENT, commentSchema);

// report Post Model
interface reportPostAttributes extends Document{
    userId: mongoose.Types.ObjectId,
    postId: mongoose.Types.ObjectId
}

const reportPostSchema: Schema = new mongoose.Schema(
    {
        userId: {type: mongoose.Schema.ObjectId, required: true, ref: DB_MODEL_REF.USER},
        postId: {type: mongoose.Schema.ObjectId, required: true, ref: DB_MODEL_REF.POST}
    },
    {timestamps: true}
);

export const reportposts: Model<reportPostAttributes> = model<reportPostAttributes>(DB_MODEL_REF.REPORT_POST, reportPostSchema);
