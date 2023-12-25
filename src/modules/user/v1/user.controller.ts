"use strict";

import { UserServiceV1 } from "..";
import { MESSAGES, SERVER, STATUS, TOKEN_TYPE } from "../../../config";
import { createToken, create_reset_pass_token, logger, mailManager } from "../../../lib";
import { UserRequest } from "../UserRequest";
import {
    LogoutUserFromAllDevices,
    RedisConnection,
    encryptHashPassword,
    getRandomOtp,
    increaseAttempts,
    isBlocked,
    matchOTP,
    matchPassword
} from "../../../utils";
import { sessionHistoryServ } from "../../sessionHistory";

export class UserController {

    /**
     * @function removeSession remove session from redis and db also
     * @param params.userId user id (required)
     */
    async removeSession(params: UserRequest.RemoveSession) {
        try {
            await sessionHistoryServ.removeSessionById({ userId: params.userId, deviceId: params.deviceId });

            const key = await RedisConnection.getKey(`${params.userId}_${params.deviceId}`);
            const sessionData = JSON.parse(key);
            // console.log(sessionData)
            if (key) {
                await RedisConnection.deleteKey(`${sessionData.userId}_${params.deviceId}`);
            }
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function signUp
     * @description signup of user
     * @param params.email: user's email (required)
     * @param params.password: user's password (required)
     * @param params.username: user username (required)
     */
    async signUp(params: UserRequest.SignUp) {

        try {
            const isExist = await UserServiceV1.isEmailExists(params); // to check is email already exists or not
            if (isExist) {
                if (isExist.accountVerify === 0) {
                    return Promise.reject(MESSAGES.ERROR.EMAIL_NOT_VERIFIED);
                }
                return Promise.reject(MESSAGES.ERROR.EMAIL_ALREADY_EXIST);
            }

            const isUsernmae = await UserServiceV1.findUserByUsername(params.username);
            if (isUsernmae) {
                return Promise.reject(MESSAGES.ERROR.USERNAME_ALREADY_TAKEN);
            }

            params.password = await encryptHashPassword(params.password, SERVER.SALT_ROUNDS);
            const user = await UserServiceV1.signUp(params);

            // const ttl = await RedisConnection.ttl(`${params.email}_verification`)
            const otp: any = getRandomOtp();
            logger.info("Verification OTP: ", otp);
            await RedisConnection.setKey(`${params.email}_verification`, JSON.stringify(otp), { EX: 60 });
            await mailManager.verifyUser({ email: params.email, otp: otp });
            await increaseAttempts(params.email);
            return MESSAGES.SUCCESS.SIGNUP({});

        } catch (error) {
            throw error;
        }
    }

    /**
     * @function verifyUser
     * @description Account Verification of User
     * @param params.email: user's email (required)
     * @param params.otp: user's opt (required)
     */

    async VerifyUser(params: UserRequest.VerifyOtp) {
        try {
            const isExist = await UserServiceV1.isEmailExists(params); // to check is email already exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            const redisOTP = await RedisConnection.getKey(`${params.email}_verification`);
            // console.log("verify otp redis",redisOTP)
            const isOTPMatched = await matchOTP(params.otp, redisOTP);
            if (!isOTPMatched) return Promise.reject(MESSAGES.ERROR.INVALID_OTP);

            else {
                const data = await UserServiceV1.VerifyUser(params);
                return MESSAGES.SUCCESS.VERIFY_OTP(data);
            }
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function resendOtpVerifyUser resend the otp for verify user
     * @param params.email email (required)
     */
    async resendOtpVerifyUser(params: UserRequest.SendOtp) {
        try {
            const isExist = await UserServiceV1.isEmailExists(params); // to check is email already exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }

            const ttl = await RedisConnection.ttl(`${params.email}_verification`)
            if (ttl > 1)
                return Promise.reject(MESSAGES.ERROR.SERVICE_UNAVAILABLE(ttl));

            if (await isBlocked(params.email))
                return Promise.reject(MESSAGES.ERROR.TOO_MANY_REQUESTS)

            const otp: any = getRandomOtp();
            logger.info("Verification OTP: ", otp);
            await RedisConnection.setKey(`${params.email}_verification`, JSON.stringify(otp), { EX: 60 });
            await mailManager.verifyUser({ email: params.email, otp: otp });
            await increaseAttempts(params.email)
            return MESSAGES.SUCCESS.SEND_OTP;
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function login
     * @description signin of user
     * @param params.email: user's email (required)
     * @param params.password: user's password (required)
     */
    async login(params: UserRequest.Login, headers: any) {
        try {
            const user = await UserServiceV1.isEmailExists(params);
            if (!user) return Promise.reject(MESSAGES.ERROR.EMAIL_NOT_REGISTERED);
            if (user.accountVerify === STATUS.BLOCKED) {
                await this.resendOtpVerifyUser({ email: user.email });
                return Promise.reject(MESSAGES.ERROR.BLOCKED);
            }

            const isPasswordMatched = await matchPassword(params.password, user.password);
            if (!isPasswordMatched) return Promise.reject(MESSAGES.ERROR.INCORRECT_PASSWORD);

            const tokenData = {
                "userId": user._id,
                "deviceId": headers.deviceid || '1001',
                "type": TOKEN_TYPE.USER_LOGIN,
            }
            const [accessToken, userSession] = await Promise.all([
                createToken(<any>tokenData),
                sessionHistoryServ.createSession({ userId: user._id, deviceId: headers.deviceid || "1001", deviceToken: headers.devicetoken || SERVER.FCM_TOKEN })
            ]);

            await RedisConnection.setKey(`${user._id}_${userSession.deviceId || "1001"}`, JSON.stringify({ userId: userSession.userId, deviceId: userSession.deviceId, isActive: userSession.isActive }), { EX: SERVER.TOKEN_INFO.EXPIRATION_TIME.USER_LOGIN });

            logger.info(<any>MESSAGES.SUCCESS.LOGIN);
            return MESSAGES.SUCCESS.LOGIN({ user, accessToken });
        } catch (error) {
            throw error;
        }
    }

    /**
     * @function forgotPassword
     */
    async forgotPassword(params: UserRequest.ForgotPassword) {
        try {
            const step1 = await UserServiceV1.isEmailExists(params); // check is email exist if not then restrict to send forgot password mail
            if (!step1) return Promise.reject(MESSAGES.ERROR.EMAIL_NOT_REGISTERED);
            if (step1.status === STATUS.BLOCKED) return Promise.reject(MESSAGES.ERROR.BLOCKED);

            const ttl = await RedisConnection.ttl(`${params.email}_forgot_pass_verifyKey`)
            if (ttl > 1)
                return Promise.reject(MESSAGES.ERROR.SERVICE_UNAVAILABLE(ttl));

            if (await isBlocked(params.email))
                return Promise.reject(MESSAGES.ERROR.TOO_MANY_REQUESTS)

            let otp = getRandomOtp().toString();
            logger.info("Verification OTP: ", otp);
            await RedisConnection.setKey(`${params.email}_forgot_pass_verifyKey`, JSON.stringify(otp), { EX: 60 });
            mailManager.forgotPasswordMail({ "email": params.email, "otp": otp });
            await increaseAttempts(params.email)
            return MESSAGES.SUCCESS.SEND_OTP;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @function VerifyOTP
     */

    async VerifyOTP(params: UserRequest.VerifyOtp) {
        try {
            const user = await UserServiceV1.isEmailExists(params);
            if (!user) {
                return Promise.reject(MESSAGES.ERROR.EMAIL_NOT_REGISTERED)
            }
            const otp = await RedisConnection.getKey(`${params.email}_forgot_pass_verifyKey`);

            const isOTPMatched = await matchOTP(params.otp, otp);
            if (!isOTPMatched) {
                return Promise.reject(MESSAGES.ERROR.INVALID_OTP);
            }
            const tokenData = {
                "userId": user._id,
                "type": TOKEN_TYPE.FORGOTPASS_VERIFY,
            }
            const token = await create_reset_pass_token(<any>tokenData);
            // console.log(token);
            return MESSAGES.SUCCESS.VERIFY_OTP({ resetPasswordToken: token });
        }
        catch (error) {
            throw error;
        }
    }

    async resetPassword(params: UserRequest.ChangeForgotPassword) {
        try {
            const user = await UserServiceV1.findUserById(params.UserId);
            const isPasswordMatched = await matchPassword(params.newPassword, user.password);
            if (isPasswordMatched) {
                return Promise.reject(MESSAGES.ERROR.ENTER_NEW_PASSWORD);
            }
            
            params.newPassword = await encryptHashPassword(params.newPassword, SERVER.SALT_ROUNDS);
            await UserServiceV1.changePassword(params);
            await LogoutUserFromAllDevices(params.UserId);
            return MESSAGES.SUCCESS.RESET_PASSWORD;

        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function userProfile 
     * @param params.userId user id (required);
     */
    async userProfile(params: UserRequest.GetUserProfile) {
        try {
            const user = await UserServiceV1.findUserById(params.UserId);
            if (!user) {
                return Promise.reject(MESSAGES.ERROR.EMAIL_NOT_REGISTERED);
            }

            const result = await UserServiceV1.userProfile(params);
            return MESSAGES.SUCCESS.LIST({ UserPofile: result });
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function logout
     */
    async logout(params: any) {
        try {
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is email already exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            await this.removeSession({ userId: params.UserId, deviceId: params.deviceId });
            return MESSAGES.SUCCESS.USER_LOGOUT;
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function editProfile
     */
    async editProfile(params: UserRequest.editProfile) {
        try {
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is email already exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            if (params.username && params.username!=isExist.username) {
                const isUsernmae = await UserServiceV1.findUserByUsername(params.username);
                if (isUsernmae) {
                    return Promise.reject(MESSAGES.ERROR.USERNAME_ALREADY_TAKEN);
                }
            }

            const result = await UserServiceV1.editProfile(params, isExist);
            return MESSAGES.SUCCESS.EDIT_PROFILE;

        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function userFeed
     * @description get the user feed data
     * @param params.UserId User Id (required)
     */
    async userFeed(params: UserRequest.UserFeed, tokenData: any) {
        try {
            const isExist = await UserServiceV1.findUserById(tokenData.UserId); // to check is email already exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }
            const result = await UserServiceV1.userFeed(params, tokenData);
            logger.info("User feed data", result);
            return MESSAGES.SUCCESS.FEED({Feed:result});
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function userSearch search a user by username or email
     * @param params.name name or username (required)
     */
    async userSearch(params: any) {
        try {
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is email already exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }

            let result = await UserServiceV1.userSearch(params.name);
            if (!result.length) {
                return Promise.reject(MESSAGES.ERROR.USER_NOT_FOUND);
            }
            return MESSAGES.SUCCESS.LIST(result);
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @function allUsers get all users
     */
    async allUsers(params: any) {
        try {
            const isExist = await UserServiceV1.findUserById(params.UserId); // to check is email already exists or not
            if (!isExist) {
                return Promise.reject(MESSAGES.ERROR.USER_DOES_NOT_EXIST);
            }

            let result = await UserServiceV1.allUsers(params.UserId);
            if (!result.length) {
                return Promise.reject(MESSAGES.ERROR.USER_NOT_FOUND);
            }
            return MESSAGES.SUCCESS.LIST(result);
        }
        catch (error) {
            throw error;
        }
    }

}

export const userController = new UserController();