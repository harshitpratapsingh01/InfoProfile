import * as Boom  from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";
import * as randomstring from "randomstring";
import bcrypt from "bcrypt";
import * as fs from "fs";
import {logger } from "../lib";
import path from "path";
import mongoose from "mongoose";
import { RedisConnection } from "./Redis";
import { sessionHistoryServ } from "../modules/sessionHistory";
import { baseEntity } from "../modules/baseEntity";
import { DB_MODEL_REF } from "../config";
const TAG = "social-app-uploads";


const encryptHashPassword = async function (password: string, salt: number) {
	
    const hash = await bcrypt.hash(password, salt);
	return hash;
};

const getRandomOtp = function () {
	return Math.floor(1000 + Math.random() * 9000);
};

const matchOTP = async function (otp: string, redisOTP) {
	if (!redisOTP) return false;
	redisOTP = JSON.parse(redisOTP);
	if (otp != redisOTP) {
		return false;
	} else
		return true;
};

const matchPassword = async function (password: string, dbHash: string) {
    if(!password)return false;
	if (!await bcrypt.compare(password, dbHash)) {
		return false;
	} else
		return true;
};

const stringToBoolean = function (value: string) {
	switch (value.toString().toLowerCase().trim()) {
		case "true":
		case "yes":
		case "1":
			return true;
		case "false":
		case "no":
		case "0":
		case null:
			return false;
		default:
			return Boolean(value);
	}
};

const  increaseAttempts = async function(email: string) {
    const attempts = parseInt(await RedisConnection.getKey(`${email}_attempts`)) || 0
    await RedisConnection.setKey(`${email}_attempts`, (attempts + 1).toString(), {EX: 600})
}

const isBlocked = async function(email: string) {
    const attempts = await parseInt(await RedisConnection.getKey(`${email}_attempts`)) || 0
    if (attempts >= 5){
        return true;
	}
	else{
		return false;
	}
}

const getDynamicName = function (file) {
	return file.hapi ? (new Date().getTime() + "_" + randomstring.generate(5) + path.extname(file.hapi.filename)) : (new Date().getTime() + "_" + randomstring.generate(5) + path.extname(file.filename));
};

const LogoutUserFromAllDevices = async function (UserId: string) {
	try {
		const query: any = {};
		query.userId = toObjectId(UserId);
		const sessions = await baseEntity.find(<any>DB_MODEL_REF.SESSION, query, {});
		await sessionHistoryServ.removeAllSessionById(UserId);
		for(let i = 0; i<sessions.length; i++){
			const key = await RedisConnection.getKey(`${UserId}_${sessions[i].deviceId}`);
			const sessionData = JSON.parse(key);
			if (key) {
				await RedisConnection.deleteKey(`${sessionData.userId}_${sessionData.deviceId}`);
			}
		}
	}
	catch (error) {
		throw error;
	}
}

// const deleteFiles = async function (filePath) {
// 	// delete files inside folder but not the folder itself
// 	await del([`${filePath}`, `!${SERVER.UPLOAD_DIR}`]);
// 	// fs.unlink(filePath, (err) => {
// 	// 	if (err) {
// 	// 		console.error(err)
// 	// 		return;
// 	// 	}
// 	// });
// 	logger.info(TAG, "All files deleted successfully.");
// };

const toObjectId = function (_id: string): mongoose.Types.ObjectId {
	return new mongoose.Types.ObjectId(_id);
};

const deleteFiles = async function (filePath) {
	try {
	  // Use del with await to delete files inside the folder, excluding the folder itself.
	  await fs.rmSync(filePath, {
		force: true,
		});
  
	  // Optionally, you can log a success message.
	  logger.info(TAG, "All files deleted successfully.");
	} catch (error) {
	  // Handle any potential errors.
	  console.error("Error deleting files:", error);
	}
};

const failActionFunction = async function (request: Request, h: ResponseToolkit, error: any) {
	let customErrorMessage = "";
	if (error.name === "ValidationError") {
		customErrorMessage = error.details[0].message;
	} else {
		customErrorMessage = error.output.payload.message;
	}
	customErrorMessage = customErrorMessage.replace(/"/g, "");
	customErrorMessage = customErrorMessage.replace("[", "");
	customErrorMessage = customErrorMessage.replace("]", "");
	return Boom.badRequest(customErrorMessage);
};

export{
    encryptHashPassword, 
    failActionFunction, 
    getRandomOtp, 
    matchOTP, 
    matchPassword,
    isBlocked,
    increaseAttempts,
    stringToBoolean,
	getDynamicName,
	deleteFiles,
	toObjectId,
	LogoutUserFromAllDevices
}