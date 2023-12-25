import { REGEX, 
    SERVER } from "../../../config";
import { failActionFunction, responseHandler } from "../../../utils";
import { Request, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi"
import { FollowRequest } from "../followerFollowing.request";
import { FollowControllerV1 } from "..";

export const followRoute = [
    {
		method: "POST",
		path: `${SERVER.API_BASE_URL}/v1/user/followUser`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
				const followingId: FollowRequest.FollowUser = request.query;
				const result = await FollowControllerV1.followUser({...data,...followingId});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','profile'],
			validate: {
				query: Joi.object({
                    followingId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
				}),
				options: {
					allowUnknown: true,
					security: [{ apiKey: [] }]
				},
				failAction: failActionFunction
			},
		}
	},

    {
		method: "DELETE",
		path: `${SERVER.API_BASE_URL}/v1/user/unfollowUser`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
				const followingId: FollowRequest.FollowUser = request.query;
				const result = await FollowControllerV1.unfollowUser({...data,...followingId});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','profile'],
			validate: {
				query: Joi.object({
                    followingId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
				}),
				options: {
					allowUnknown: true,
					security: [{ apiKey: [] }]
				},
				failAction: failActionFunction
			},
		}
	},

    {
		method: "GET",
		path: `${SERVER.API_BASE_URL}/v1/user/getFollowers`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
				const userId: FollowRequest.FollowUser = request.query;
				const result = await FollowControllerV1.getFollowers({...data, ...userId});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','profile'],
			validate: {
				query: Joi.object({
                    userId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
				}),
				options: {
					allowUnknown: true,
					security: [{ apiKey: [] }]
				},
				failAction: failActionFunction
			},
		}
	},

    {
		method: "GET",
		path: `${SERVER.API_BASE_URL}/v1/user/getFollowing`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
				const userId: FollowRequest.FollowUser = request.query;
				const result = await FollowControllerV1.getFollowing({...data, ...userId});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','profile'],
			validate: {
				query: Joi.object({
                    userId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
				}),
				options: {
					allowUnknown: true,
					security: [{ apiKey: [] }]
				},
				failAction: failActionFunction
			},
		}
	},
]