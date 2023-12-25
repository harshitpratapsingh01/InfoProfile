"use strict";

import { Request, ResponseToolkit } from "@hapi/hapi";
import * as Joi from "joi";


import { REGEX, SERVER, SWAGGER_DEFAULT_RESPONSE_MESSAGES } from "../../../config";
import { ListingRequest, TokenData } from "../../../interfaces/Model";
import { failActionFunction, responseHandler } from "../../../utils";
import { notificationControllerV1 } from "..";
import { NotificationRequest } from "../notificationRequest";

export const notificationRoute = [
    {
		method: "POST",
		path: `${SERVER.API_BASE_URL}/v1/AddNotification`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const {data} = request;
                const payload: NotificationRequest.Add = request.payload
				const result = await notificationControllerV1.addNotification(payload, data);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "notification"],
			description: "Notification List",
			auth: 'user',
			validate: {
				payload: Joi.object({
					receiverId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
                    activityId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
                    type: Joi.string().trim().required(),
				}),
				failAction: failActionFunction
			},
		}
	},
	{
		method: "GET",
		path: `${SERVER.API_BASE_URL}/v1/notification`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const query:ListingRequest = request.query;
				const {data} = request;
				const result = await notificationControllerV1.notificationList(query, data);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "notification"],
			description: "Notification List",
			auth: 'user',
			validate: {
				query: Joi.object({
					pageNo: Joi.number().required().description("Page no"),
					limit: Joi.number().required().description("limit")
				}),
				failAction: failActionFunction
			},
		}
	},
	{
		method: "DELETE",
		path: `${SERVER.API_BASE_URL}/v1/deleteNotification`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
			    const {data} = request;
                const query: NotificationRequest.Id = request.query;
				const result = await notificationControllerV1.notificationDelete(query,data);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "notification"],
			description: "Notification Clear/Delete",
			auth: "user",
			validate: {
                query: Joi.object({
                    notificationId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
                }),
				failAction: failActionFunction
			},
		}
	},
];