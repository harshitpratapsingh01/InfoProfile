"use strict"
const mongoose = require("mongoose");
import { Schema, Document, model, Model } from 'mongoose';
import { DB_MODEL_REF, SERVER } from '../../config';


interface UserAttributes extends Document {
    username: string
    email: string;
    password: string;
    fullName: string;
    profile_pic: string;
    profile_bio: string;
    accountVerify: number;
    followerCount: number;
    followingCount: number;
    postCount: number;
}

const userSchema: Schema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, },
        fullName: { type: String, required: false, },
        profilePic: { type: String, required: false },
        profileBio: { type: String, required: false },
        accountVerify: { type: Number, required: true, default: 0 },
        followerCount: {type: Number, required: true, default: 0},
        followingCount: {type: Number, required: true, default: 0},
        postCount: {type: Number, required: true, default: 0}
    },
    { timestamps: true }
);

userSchema.index({
    username: 'text',
    fullName: 'text'
})

export const users: Model<UserAttributes> = model<UserAttributes>(DB_MODEL_REF.USER, userSchema);

