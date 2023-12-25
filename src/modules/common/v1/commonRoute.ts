// "use strict";

// import { Request, ResponseToolkit } from "@hapi/hapi";
// import * as Joi from "joi";

// import {
// 	fileUploadExts,
// 	SWAGGER_DEFAULT_RESPONSE_MESSAGES,
// 	SERVER
// } from "../../../config/index";
// import { imageUtil } from "../../../lib/imageUtil";
// import { failActionFunction, responseHandler } from "../../../utils";

// export const commonRoute = [
// 	{
// 		method: "POST",
// 		path: `${SERVER.API_BASE_URL}/v1/common/media-upload`,
// 		handler: async (request: Request | any, h: ResponseToolkit) => {
// 			try {
// 				const payload = request.payload;
// 				const result = { "image": await imageUtil.uploadSingleMediaToS3(payload.file) };
// 				return responseHandler.sendSuccess(h, result);
// 			} catch (error) {
// 				return responseHandler.sendError(request, error);
// 			}
// 		},
// 		config: {
// 			tags: ["api", "common"],
// 			description: "Media Upload",
// 			auth: 'user',
// 			payload: {
// 				maxBytes: 1000 * 1000 * 500,
// 				output: "stream",
// 				allow: "multipart/form-data", // important
// 				parse: true,
// 				timeout: false,
// 				multipart: true // <-- this fixed the media type error
// 			},
// 			validate: {
// 				payload: Joi.object({
// 					file: Joi.any().meta({ swaggerType: "file" }).required().description(fileUploadExts.join(", "))
// 				}),
// 				failAction: failActionFunction
// 			},
// 			plugins: {
// 				"hapi-swagger": {
// 					payloadType: "form",
// 					responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES
// 				}
// 			}
// 		}
// 	},

    // {
    //     method: "GET",
    //     path: '${SERVER.API_BASE_URL}/v1/common/share',
    //     handler: async (request: Request | any, h: ResponseToolkit) => {
    //         try{
    //             const query = request.query;
    //             // const result = 
    //         }   
    //         catch(error){
    //             return responseHandler.sendError(request,error);
    //         }                                                                                                                                                                                                                                                                                                                                   
    //     },
    // }

// ];