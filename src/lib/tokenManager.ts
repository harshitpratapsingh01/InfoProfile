"use strict";

import { MESSAGES, SERVER } from '../config';
import Jwt from "jsonwebtoken"

const createToken = async (
	data: {
		userId: any,
        type: string,
		deviceId: string
	}
): Promise<string> => {
	const Token = await Jwt.sign({UserId : data.userId, deviceId: data.deviceId, tokenType: data.type}, SERVER.SECRET_KEY, {expiresIn: SERVER.TOKEN_INFO.EXPIRATION_TIME[data.type]});
	if (!Token) return Promise.reject(MESSAGES.ERROR.TOKEN_GENERATE_ERROR);

	return Token;
};

const create_reset_pass_token = async (
	data: {
		userId: any,
        type: string,
	}
): Promise<string> => {
	const Token = await Jwt.sign({UserId : data.userId, tokenType: data.type}, SERVER.SECRET_KEY, {expiresIn: SERVER.TOKEN_INFO.EXPIRATION_TIME[data.type]});
	if (!Token) return Promise.reject(MESSAGES.ERROR.TOKEN_GENERATE_ERROR);

	return Token;
};


export {
	createToken,
	create_reset_pass_token
};