"use strict"

import mongoose, { Schema, Document, model, Model } from 'mongoose';
import { DB_MODEL_REF } from '../../config';


interface FollowAttributes extends Document {
    userId: mongoose.Types.ObjectId
    followingId: mongoose.Types.ObjectId
}

const followSchema: Schema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.ObjectId, required: true, ref: DB_MODEL_REF.USER },
        followingId: {type: mongoose.Schema.ObjectId, required: true, ref: DB_MODEL_REF.USER},
    },
    { timestamps: true }
);


export const follows: Model<FollowAttributes> = model<FollowAttributes>(DB_MODEL_REF.FOLLOW, followSchema);
