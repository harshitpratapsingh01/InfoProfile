import mongoose, {Document, Schema, Model, model}  from "mongoose";
import { DB_MODEL_REF, NOTIFICATION_TYPE, STATUS } from "../../config";

interface NotificationAttributes extends Document {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    activityId:  mongoose.Types.ObjectId;
    status: string;
    image: string;
    isRead: boolean;
    type: string;
    title: string;
    message: string;
}

const notificationSchema: Schema = new mongoose.Schema(
    {
        senderId: {type: mongoose.Schema.ObjectId, required: true, ref: DB_MODEL_REF.USER},
        receiverId: {type: mongoose.Schema.ObjectId, required: true, ref: DB_MODEL_REF.USER},
        activityId: {type: mongoose.Schema.ObjectId, required: true},
        status: {type: String, required: false, enum: [STATUS.READ, STATUS.UNREAD], default: STATUS.UNREAD},
        isRead: {type: Boolean, required: false, default: false},
        type: {type: String,required: true, enum: Object.values(NOTIFICATION_TYPE) },
        title: {type: String, required: true},
        message: {type: String, required: true},
        image: {type: String, required: false}
    },
    { timestamps: true }
);

export const notifications: Model<NotificationAttributes> = model<NotificationAttributes>(DB_MODEL_REF.NOTIFICATION, notificationSchema);

