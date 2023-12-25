"use strict"

import mongoose, { Schema, Document, model, Model } from 'mongoose';
import { DB_MODEL_REF } from '../../config';


interface SessionAttributes extends Document {
    userId: mongoose.Types.ObjectId;
    isActive: boolean;
    deviceId: string;
    fcm_token: string;
}

const ssessionSchema: Schema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.ObjectId, required: true, ref: DB_MODEL_REF.USER },
        deviceId: {type: String, required: true},
        isActive: { type: Boolean, required: false, default: false },
        lastLogin: { type: Number, required: false },
        fcm_token: {type: String, required: false}
    },
    { timestamps: true }
);


export const sessions: Model<SessionAttributes> = model<SessionAttributes>(DB_MODEL_REF.SESSION, ssessionSchema);
