import { REGEX, 
    SERVER } from "../../../config";
import { failActionFunction, responseHandler } from "../../../utils";
import { Request, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi"
import { PostRequest } from "../post.request";
import { PostControllerV1 } from "..";

export const postRoute = [
    {
		method: "POST",
		path: `${SERVER.API_BASE_URL}/v1/user/createPost`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
				const payload: PostRequest.CreatePost = request.payload;
				// console.log(payload);
				const result = await PostControllerV1.createPost({...data,...payload});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','post'],
			validate: {
				payload: Joi.object({
                    url: Joi.string().trim().required(),
                    caption: Joi.string(),
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
		path: `${SERVER.API_BASE_URL}/v1/user/editPost`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
                const postId: PostRequest.PostId = request.query;
				const payload: PostRequest.EditPost = request.payload;
				const result = await PostControllerV1.editPost({...data,...payload,...postId});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','post'],
			validate: {
				payload: Joi.object({
                    caption: Joi.string().trim(),
				}),
                query: Joi.object({
                    postId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
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
		path: `${SERVER.API_BASE_URL}/v1/user/deletePost`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
                const postId: PostRequest.PostId = request.query
				const result = await PostControllerV1.deletePost({...data,...postId});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','post'],
			validate: {
                query: Joi.object({
                    postId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
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
		path: `${SERVER.API_BASE_URL}/v1/user/getMyPost`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
				const result = await PostControllerV1.getMyPost(data);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','post'],
			validate: {
				options: {
					allowUnknown: true,
					security: [{ apiKey: [] }]
				}
			},
		}
	},

    {
		method: "GET",
		path: `${SERVER.API_BASE_URL}/v1/user/getUserPost`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
                const userId = request.query;
				const result = await PostControllerV1.getUserPost({...data, ...userId});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','post'],
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
		path: `${SERVER.API_BASE_URL}/v1/user/post`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
                const query = request.query;
				const result = await PostControllerV1.getSinglePost({...data, ...query});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','post'],
            validate: {
                query: Joi.object({
                    postId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
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
		path: `${SERVER.API_BASE_URL}/v1/user/postLike`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
                const postId: PostRequest.PostLike = request.query;
				const result = await PostControllerV1.postLike({...data, ...postId});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','post'],
            validate: {
                query: Joi.object({
                    postId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
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
		path: `${SERVER.API_BASE_URL}/v1/user/postDislike`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
                const postId: PostRequest.PostLike = request.query;
				const result = await PostControllerV1.postDislike({...data, ...postId});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','post'],
            validate: {
                query: Joi.object({
                    postId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
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
		path: `${SERVER.API_BASE_URL}/v1/user/getPostLikes`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
                const query: PostRequest.PostLike = request.query;
				const result = await PostControllerV1.postLikesList({...data, ...query});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','post'],
            validate: {
                query: Joi.object({
					pageNo: Joi.number().required().description("Page no"),
					limit: Joi.number().required().description("limit"),
                    postId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
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
		path: `${SERVER.API_BASE_URL}/v1/user/createComment`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
                const postId: PostRequest.PostComment = request.query;
				const payload: PostRequest.PostComment = request.payload;
				const result = await PostControllerV1.createComment({...data, ...postId, ...payload});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','post'],
            validate: {
                query: Joi.object({
                    postId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
                }),
				payload: Joi.object({
                    comment: Joi.string().trim().required(),
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
		path: `${SERVER.API_BASE_URL}/v1/user/listComments`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
                const query: PostRequest.PostLike = request.query;
				const result = await PostControllerV1.listComment({...data, ...query});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','post'],
            validate: {
                query: Joi.object({
					pageNo: Joi.number().required().description("Page no"),
					limit: Joi.number().required().description("limit"),
                    postId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
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
		path: `${SERVER.API_BASE_URL}/v1/user/deleteComment`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
                const queryParams:any = request.query;
				console.log(queryParams);
				const result = await PostControllerV1.deleteComment({...data, ...queryParams});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','post'],
            validate: {
                query: Joi.object({
                    postId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
					commentId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
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
		path: `${SERVER.API_BASE_URL}/v1/user/editComment`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
                const query:any = request.query;
				const payload: PostRequest.PostComment = request.payload;
				const result = await PostControllerV1.editComment({...data, ...query, ...payload});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','post'],
            validate: {
                query: Joi.object({
                    postId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
					commentId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
                }),
				payload: Joi.object({
                    comment: Joi.string().trim().required(),
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
		path: `${SERVER.API_BASE_URL}/v1/user/reportPost`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
                const {data} = request;
                const query:any = request.query;
				const result = await PostControllerV1.reportPost({...data, ...query});
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		options: {
            auth: 'user',
			tags: ['api','post'],
            validate: {
                query: Joi.object({
                    postId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
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