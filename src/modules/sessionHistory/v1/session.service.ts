"use strict";

import { DB_MODEL_REF } from "../../../config";
import { BaseEntity } from "../../baseEntity";

export class SessionHistory extends BaseEntity{

    /**
	 * @function createUserSessionHistory
	 */
    async createSession(params){
        try {
			const query: any = {
				$and: [
					{userId: params.userId},
					{deviceId: params.deviceId}
				]
			};

			const isSession = await this.findOne(<any>DB_MODEL_REF.SESSION, query);
			if(!isSession){
				const sessionHistoryData = {
					"userId": params.userId,
					"deviceId": params.deviceId,
					"isActive": true,
					"lastLogin": Date.now(),
					"fcm_token": params.deviceToken
				}
				let sessionHistory = await this.save(<any>DB_MODEL_REF.SESSION, sessionHistoryData);
				return sessionHistory;
			}
			else{
				const update = {};
				update["$set"] = {
					isActive: true
				}

				const updateSession = await this.findOneAndUpdate(<any>DB_MODEL_REF.SESSION, query, update);
				return updateSession;
			}
        } catch (error) {
            throw error;
        }
    }

    /**
	 * @function removeSessionById
	 */
	async removeSessionById(params) {
		try {
			const query: any = {
				$and: [
					{userId: params.userId},
					{deviceId: params.deviceId}
				]
			};

			const update = {};
			update["$set"] = {
				isActive: false
			};

			const options = { multi: true };

			return await this.updateMany(<any>DB_MODEL_REF.SESSION, query, update, options);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @function removeAllSessionById
	 */
	async removeAllSessionById(UserId: string) {
		try {
			console.log(UserId);
			const query: any = {};
			query.userId = UserId

			const update = {};
			update["$set"] = {
				isActive: false
			};

			const options = { multi: true };

			const result = await this.updateMany(<any>DB_MODEL_REF.SESSION, query, update, options);
			return result;
		} catch (error) {
			throw error;
		}
	}
}

export const sessionHistoryServ = new SessionHistory();