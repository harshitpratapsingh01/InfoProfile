"use strict";

import { Request, ResponseToolkit } from "@hapi/hapi";
import * as Joi from "joi";
import { UserRequest } from "../UserRequest";
import { REGEX, SERVER, VALIDATION_CRITERIA, VALIDATION_MESSAGE } from "../../../config";
import { userControllerV1 } from "../index";
import { failActionFunction, responseHandler } from "../../../utils";
import { AuthMiddleware } from "../../../plugins";

export const userRoute = [
	{
		method: "POST",
		path: `${SERVER.API_BASE_URL}/v1/user/signup`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const payload: UserRequest.SignUp = request.payload;
				const result = await userControllerV1.signUp(payload);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
			tags: ['api', 'user'],
			pre: [{ method: AuthMiddleware.basicAuth }],
			validate: {
				payload: Joi.object({
					email: Joi.string()
						.trim()
						.lowercase()
						.email({ minDomainSegments: 2 })
						.regex(REGEX.EMAIL)
						.required(),
					password: Joi.string()
						.trim()
						.regex(REGEX.PASSWORD)
						.min(VALIDATION_CRITERIA.PASSWORD_MIN_LENGTH)
						.max(VALIDATION_CRITERIA.PASSWORD_MAX_LENGTH)
						.default(SERVER.DEFAULT_PASSWORD)
						.required()
						.messages({
							"string.pattern.base": VALIDATION_MESSAGE.password.pattern,
							"string.min": VALIDATION_MESSAGE.password.minlength,
							"string.max": VALIDATION_MESSAGE.password.maxlength,
							"string.empty": VALIDATION_MESSAGE.password.required,
							"any.required": VALIDATION_MESSAGE.password.required
						}),
					username: Joi.string()
						.trim()
						.required()
						.min(VALIDATION_CRITERIA.NAME_MIN_LENGTH)
						.max(VALIDATION_CRITERIA.NAME_MAX_LENGTH),
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
		method: "POST",
		path: `${SERVER.API_BASE_URL}/v1/user/verifyUser`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const payload: UserRequest.VerifyOtp = request.payload;
				console.log(payload);
				const result = await userControllerV1.VerifyUser(payload);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
			tags: ['api', 'user'],
			validate: {
				payload: Joi.object({
					email: Joi.string()
						.trim()
						.lowercase()
						.email({ minDomainSegments: 2 })
						.regex(REGEX.EMAIL)
						.required(),
					otp: Joi.string().default(SERVER.DEFAULT_OTP).required(),
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
		method: "POST",
		path: `${SERVER.API_BASE_URL}/v1/user/send-otp-verify`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const payload: UserRequest.SendOtp = request.payload;
				const result = await userControllerV1.resendOtpVerifyUser(payload);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
			tags: ['api', 'user'],
			validate: {
				payload: Joi.object({
					email: Joi.string()
						.trim()
						.lowercase()
						.email({ minDomainSegments: 2 })
						.regex(REGEX.EMAIL)
						.required(),
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
		method: "POST",
		path: `${SERVER.API_BASE_URL}/v1/user/login`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const headers = request.headers;
				const payload: UserRequest.Login = request.payload;
				const result = await userControllerV1.login(payload, headers);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
			tags: ['api', 'user'],
			validate: {
				payload: Joi.object({
					email: Joi.string()
						.trim()
						.lowercase()
						.email({ minDomainSegments: 2 })
						.regex(REGEX.EMAIL)
						.required(),
					password: Joi.string()
						.trim()
						.default(SERVER.DEFAULT_PASSWORD)
						.required(),
				}),
				headers: Joi.object({
					deviceId: Joi.string().trim().optional(),
					deviceToken: Joi.string().trim().optional()
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
		method: "POST",
		path: `${SERVER.API_BASE_URL}/v1/user/forgot-password`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const payload: UserRequest.ForgotPassword = request.payload;
				const result = await userControllerV1.forgotPassword(payload);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
			tags: ['api', 'user'],
			validate: {
				payload: Joi.object({
					email: Joi.string()
						.trim()
						.lowercase()
						.email({ minDomainSegments: 2 })
						.regex(REGEX.EMAIL)
						.required()
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
		method: "POST",
		path: `${SERVER.API_BASE_URL}/v1/user/verifyOTP`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const payload: UserRequest.VerifyOtp = request.payload;
				const result = await userControllerV1.VerifyOTP(payload);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
			tags: ['api', 'user'],
			validate: {
				payload: Joi.object({
					email: Joi.string()
						.trim()
						.lowercase()
						.email({ minDomainSegments: 2 })
						.regex(REGEX.EMAIL)
						.required(),
					otp: Joi.string().default(SERVER.DEFAULT_OTP).required(),
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
		method: "POST",
		path: `${SERVER.API_BASE_URL}/v1/user/reset-password`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const payload: UserRequest.ChangeForgotPassword = request.payload;
				const { data } = request;
				const result: any = await userControllerV1.resetPassword({ ...data, ...payload });
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
			auth: 'reset_pass',
			tags: ['api', 'user'],
			validate: {
				payload: Joi.object({
					newPassword: Joi.string()
						.trim()
						.regex(REGEX.PASSWORD)
						.min(VALIDATION_CRITERIA.PASSWORD_MIN_LENGTH)
						.max(VALIDATION_CRITERIA.PASSWORD_MAX_LENGTH)
						.default(SERVER.DEFAULT_PASSWORD)
						.required()
						.messages({
							"string.pattern.base": VALIDATION_MESSAGE.password.pattern,
							"string.min": VALIDATION_MESSAGE.password.minlength,
							"string.max": VALIDATION_MESSAGE.password.maxlength,
							"string.empty": VALIDATION_MESSAGE.password.required,
							"any.required": VALIDATION_MESSAGE.password.required
						}),
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
		method: "POST",
		path: `${SERVER.API_BASE_URL}/v1/user/logout`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const { data } = request;
				const result = await userControllerV1.logout(data);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
			auth: 'user',
			tags: ['api', 'user'],
			validate: {
				options: {
					allowUnknown: true,
					security: [{ apiKey: [] }]
				}
			}
		}
	},

	{
		method: "GET",
		path: `${SERVER.API_BASE_URL}/v1/user/userProfile`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const { data } = request;
				const userId: UserRequest.GetUserProfile = request.query;
				const result = await userControllerV1.userProfile({ ...data, ...userId });
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
			auth: 'user',
			tags: ['api', 'user'],
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
		method: "PATCH",
		path: `${SERVER.API_BASE_URL}/v1/user/editProfile`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const { data } = request;
				const payload: UserRequest.editProfile = request.payload;
				const result = await userControllerV1.editProfile({ ...data, ...payload });
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
			auth: 'user',
			tags: ['api', 'user'],
			validate: {
				payload: Joi.object({
					username: Joi.string(),
					profilePic: Joi.string(),
					profileBio: Joi.string(),
					fullName: Joi.string()
				}),
				options: {
					allowUnknown: true,
					security: [{ apiKey: [] }]
				},
			},
		}
	},

	{
		method: "GET",
		path: `${SERVER.API_BASE_URL}/v1/user/userFeed`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const { data } = request;
				const query: UserRequest.UserFeed = request.query;
				const result = await userControllerV1.userFeed(query,data);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
			auth: 'user',
			tags: ['api', 'user'],
			validate: {
				query: Joi.object({
					pageNo: Joi.number().required().description("Page no"),
					limit: Joi.number().required().description("limit"),
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
		path: `${SERVER.API_BASE_URL}/v1/user/userSearch`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const { data } = request;
				const name:any = request.query;
				const result = await userControllerV1.userSearch({...data, ...name});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
			auth: 'user',
			tags: ['api', 'user'],
			validate: {
				query: Joi.object({
					name: Joi.string()
						.trim()
						.required()
						.min(VALIDATION_CRITERIA.SEARCH_NAME_MIN_LENGTH)
						.max(VALIDATION_CRITERIA.SEARCH_NAME_MAX_LENGTH),
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
		path: `${SERVER.API_BASE_URL}/v1/user/allUsers`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const { data } = request;
				const result = await userControllerV1.allUsers(data);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
			auth: 'user',
			tags: ['api', 'user'],
			validate: {
				options: {
					allowUnknown: true,
					security: [{ apiKey: [] }]
				},
				failAction: failActionFunction
			},
		}
	},

]