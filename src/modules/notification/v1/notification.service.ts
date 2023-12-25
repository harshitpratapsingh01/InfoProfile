"use strict";

import { DB_MODEL_REF, NOTIFICATION_MSG, NOTIFICATION_TITLE, STATUS } from "../../../config";
import { ListingRequest } from "../../../interfaces/Model";
import { toObjectId } from "../../../utils";
import { BaseEntity } from "../../baseEntity";
import { NotificationRequest } from "../notificationRequest";

export class NotificationService extends BaseEntity {

	/**
	 * @function addNotification
	 */
	async addNotification(params: NotificationRequest.Add, senderId: string, userData:any) {
		try {
            const notificationData = {
                "senderId": senderId,
                "receiverId": params.receiverId,
                "activityId": params.activityId,
                "type": params.type,
                "title": NOTIFICATION_TITLE[params.type],
                "image": userData.profilePic,
                "message": userData.username + ' ' + NOTIFICATION_MSG[params.type+"_MSG"]
            }
			return await this.save(<any>DB_MODEL_REF.NOTIFICATION, notificationData);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @function notificationList
	 */
	async notificationList(params: ListingRequest, userId: string) {
		try {
            const query:any = {};
            query.receiverId = userId;
            const update = {};
            update['$set'] = {
                status: STATUS.READ,
                isRead: true
            }
            const aggPipe = [];
			const match: any = {};
			match.receiverId = toObjectId(userId);
			aggPipe.push({ "$match": match });

			aggPipe.push({ "$sort": { createdAt: -1 } });
            
			aggPipe.push({ "$project": { updatedAt: 0, createdAt: 0, isRead: 0, __v: 0 } });


            const markRead = await this.updateMany(<any>DB_MODEL_REF.NOTIFICATION, query, update, {});
            const result = await this.paginate(<any>DB_MODEL_REF.NOTIFICATION, aggPipe, params.limit, params.pageNo, {});
            return result
		} catch (error) {
			throw error;
		}
	}

	/**
	  * @function notificationDelete
	  */
	async notificationDelete(notificationId: string, userId: string) {
        console.log(notificationId,userId)
		try {
			const query: any = {
                $and: [
                    {_id: notificationId},
                    {receiverId: userId}
                ]
            };
            
			const deleteNotification = await this.deleteOne(<any>DB_MODEL_REF.NOTIFICATION, query);
            console.log(deleteNotification);
            if(deleteNotification.deletedCount){
                return true;
            }
            else{
                return false;
            }
		} catch (error) {
			throw error;
		}
	}
}

export const notificationService = new NotificationService();