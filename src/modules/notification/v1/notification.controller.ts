"use strict";


import { MESSAGES, QUEUE_NAME } from "../../../config";
import { ListingRequest, TokenData } from "../../../interfaces/Model";
import { notificatioonServiceV1 } from "..";
import { NotificationRequest } from "../notificationRequest";
import { UserServiceV1 } from "../../user";
// import { messageQueue } from "../../../utils";
import { rabbitMQ } from "../../../utils";

export class NotificationController {

    /**
     * @function addNotification
     */
    async addNotification(params: NotificationRequest.Add, tokenData: TokenData){
        try{
            const isExist = await UserServiceV1.findUserById(tokenData.UserId);
            if(!isExist){
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }

            if(params.receiverId!=tokenData.UserId){
                const result = await notificatioonServiceV1.addNotification(params, tokenData.UserId, isExist);
                const payload = {
                    "userId": params.receiverId,
                    "message": result.message
                }
                // await messageQueue.sendToQueue(QUEUE_NAME.PUSH_NOTIFIACTION_ANDROID,payload);
                await rabbitMQ.pushNotificationAndroid(payload)
                return MESSAGES.SUCCESS.NOTIFICATION_SAVED;
            }
            else{
                return MESSAGES.ERROR.CANT_SEND_NOTIFICATION;
            }
        }
        catch(error){
            throw error;
        }
    }

	/**
	 * @function notificationList
	 */
	async notificationList(params: ListingRequest, tokenData: TokenData) {
		try {
            const isExist = await UserServiceV1.findUserById(tokenData.UserId);
            if(!isExist){
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
			const result = await notificatioonServiceV1.notificationList(params, tokenData.UserId);
			return MESSAGES.SUCCESS.LIST(result.data);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @function notificationDelete
	 */
	async notificationDelete(params: NotificationRequest.Id, tokenData: TokenData) {
		try {
            const isExist = await UserServiceV1.findUserById(tokenData.UserId);
            if(!isExist){
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }

			const result = await notificatioonServiceV1.notificationDelete(params.notificationId, tokenData.UserId);
            if(result){
                return MESSAGES.SUCCESS.NOTIFICATION_DELETED;
            }
            else{
                return MESSAGES.ERROR.CANT_DELETE_NOTIFICATION;
            }
		} catch (error) {
			throw error;
		}
	}
}

export const notificationController = new NotificationController();

