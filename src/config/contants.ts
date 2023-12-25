"use strict";

import {
	FIELD_REQUIRED as EN_FIELD_REQUIRED,
	SERVER_IS_IN_MAINTENANCE as EN_SERVER_IS_IN_MAINTENANCE,
	LINK_EXPIRED as EN_LINK_EXPIRED
} from "../../local/message.json";

const SWAGGER_DEFAULT_RESPONSE_MESSAGES = [
	{ code: 200, message: "OK" },
	{ code: 400, message: "Bad Request" },
	{ code: 401, message: "Unauthorized" },
	{ code: 404, message: "Data Not Found" },
	{ code: 500, message: "Internal Server Error" }
];

const NOTIFICATION_DATA = {
	LIKE: (username, senderId, data ) => {
		return {
			"type": NOTIFICATION_TYPE.LIKE,
			"senderId": senderId,
			"senderUserName": username,
			"image": data.profilePic,
			"message": username + ' ' + NOTIFICATION_MSG.LIKE_MSG,
			"title": NOTIFICATION_TITLE.LIKE
		}
	},
	COMMENT: (username, senderId, data) => {
		return {
			"type": NOTIFICATION_TYPE.COMMENT,
			"senderId": senderId,
			"senderUserName": username,
			"image": data.profilePic,
			"message": username + ' ' + NOTIFICATION_MSG.COMMENT_MSG,
			"title": NOTIFICATION_TITLE.COMMENT
		}
	},
	REPORT_POST:(username, senderId, data) => {
		return {
			"type": NOTIFICATION_TYPE.REPORT_POST,
			"senderId": senderId,
			"senderUserName": username,
			"image": data.profilePic,
			"message": username + ' ' + NOTIFICATION_MSG.REPORT_POST_MSG,
			"title": NOTIFICATION_TITLE.REPORT_POST
		}
	},

	FOLLOW_USER: (username, senderId, data) => {
		return {
			"type": NOTIFICATION_TYPE.FOLLOW_USER,
			"senderId": senderId,
			"senderUserName": username,
			"image": data.profilePic,
			"message": username + ' ' + NOTIFICATION_MSG.FOLLOW_USER_MSG,
			"title": NOTIFICATION_TITLE.FOLLOW_USER
		}
	},
}
const HTTP_STATUS_CODE = {
	OK: 200,
	CREATED: 201,
	UPDATED: 202,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	PAYMENY_REQUIRED: 402,
	ACCESS_FORBIDDEN: 403,
	FAV_USER_NOT_FOUND: 403,
	URL_NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	UNREGISTERED: 410,
	PAYLOAD_TOO_LARGE: 413,
	CONCURRENT_LIMITED_EXCEEDED: 429,
	// TOO_MANY_REQUESTS: 429,
	INTERNAL_SERVER_ERROR: 500,
	BAD_GATEWAY: 502,
	SHUTDOWN: 503,
	EMAIL_NOT_VERIFIED: 430,
	MOBILE_NOT_VERIFIED: 431,
	FRIEND_REQUEST_ERR: 432

};

const DB_MODEL_REF = {

	NOTIFICATION: "notifications",
	USER: "users",
	SESSION: "sessions",
	POST: "posts",
	FOLLOW: "follows",
	LIKE: "likes",
	COMMENT: "comments",
	REPORT_POST: "reportposts"
};

const MODULES = {
	NOTIFICATION_MANAGEMENT: "Notification Management",
};

const CATEGORIES_STAUS = {
	USER: "USER"
};

const STATUS = {
	BLOCKED: 0,
	UN_BLOCKED: "UN_BLOCKED",
	ACTIVE: "ACTIVE",
	DELETED: "DELETED",
	EXPIRED: "EXPIRED",
	READ: "READ",
	UNREAD: "UNREAD",
	CONFIRMED: {
		NUMBER: 1,
		TYPE: "CONFIRMED",
		DISPLAY_NAME: "Confirmed"
	},
	COMPLETED: {
		NUMBER: 2,
		TYPE: "COMPLETED",
		DISPLAY_NAME: "Completed"
	},
	CANCELLED: {
		NUMBER: 3,
		TYPE: "CANCELLED",
		DISPLAY_NAME: "Cancelled"
	},
	PENDING: {
		NUMBER: 4,
		TYPE: "PENDING",
		DISPLAY_NAME: "Pending"
	},
	NOT_ATTENTED: {
		NUMBER: 5,
		TYPE: "NOT_ATTENTED",
		DISPLAY_NAME: "Not Attended"
	},
	OLD_COMPLETED: {
		NUMBER: 6,
		TYPE: "OLD_COMPLETE",
		DISPLAY_NAME: "Old complete"
	},
	// march 14 - natasha
	SEND: {
		NUMBER: 7,
		TYPE: "SEND",
		DISPLAY_NAME: "Send"
	},
	SCHEDULE: {
		NUMBER: 8,
		TYPE: "SCHEDULE",
		DISPLAY_NAME: "Schedule"
	},
	DRAFT: {
		NUMBER: 9,
		TYPE: "DRAFT",
		DISPLAY_NAME: "Draft"
	},
};

const VALIDATION_CRITERIA = {
	FULL_NAME_MIN_LENGTH: 3,
	FULL_NAME_MAX_LENGTH: 10,
	NAME_MIN_LENGTH: 3,
	SEARCH_NAME_MIN_LENGTH: 2,
	SEARCH_NAME_MAX_LENGTH: 30,
	NAME_MAX_LENGTH: 30,
	PASSWORD_MIN_LENGTH: 6,
	PASSWORD_MAX_LENGTH: 40,
};

const NOTIFICATION_MSG = {
	LIKE_MSG: 'Liked your Post',
	COMMENT_MSG: 'Create Comment on your Post',
	REPORT_POST_MSG: 'Repoerted your Post',
	FOLLOW_USER_MSG: 'Started Following you',
}
const NOTIFICATION_TITLE = {
	LIKE: 'Like Post',
	COMMENT: 'Comment on Post',
	REPORT_POST: 'Repoert on Post',
	FOLLOW_USER: 'Follow user',
}


const VALIDATION_MESSAGE = {
	invalidId: {
		pattern: "Invalid Id."
	},
	email: {
		pattern: "Please enter email address in a valid format."
	},
	password: {
		required: "Please enter password.",
		pattern: "Please enter a valid password.",
		// pattern: `Please enter a proper password with minimum ${VALIDATION_CRITERIA.PASSWORD_MIN_LENGTH} character, which can be alphanumeric with special character allowed.`,
		minlength: `Password must be between ${VALIDATION_CRITERIA.PASSWORD_MIN_LENGTH}-${VALIDATION_CRITERIA.PASSWORD_MAX_LENGTH} characters.`,
		// maxlength: `Please enter a proper password with minimum ${VALIDATION_CRITERIA.PASSWORD_MIN_LENGTH} character, which can be alphanumeric with special character allowed.`
		maxlength: `Password must be between ${VALIDATION_CRITERIA.PASSWORD_MIN_LENGTH}-${VALIDATION_CRITERIA.PASSWORD_MAX_LENGTH} characters.`
	}
};

const MESSAGES = {
	ERROR: {
		UNAUTHORIZED_ACCESS: {
			"statusCode": HTTP_STATUS_CODE.UNAUTHORIZED,
			"type": "UNAUTHORIZED_ACCESS"
		},
		INTERNAL_SERVER_ERROR: {
			"statusCode": HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
			"type": "INTERNAL_SERVER_ERROR"
		},
		BAD_TOKEN: {
			"statusCode": HTTP_STATUS_CODE.UNAUTHORIZED,
			"type": "BAD_TOKEN"
		},
		TOKEN_EXPIRED: {
			"statusCode": HTTP_STATUS_CODE.UNAUTHORIZED,
			"type": "TOKEN_EXPIRED"
		},
		TOKEN_GENERATE_ERROR: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "TOKEN_GENERATE_ERROR"
		},
		BLOCKED: {
			"statusCode": HTTP_STATUS_CODE.UNAUTHORIZED,
			"type": "ACCOUNT_NOT_VERIFIED"
		},
		INCORRECT_PASSWORD: {
			"statusCode": HTTP_STATUS_CODE.ACCESS_FORBIDDEN,
			"type": "INCORRECT_PASSWORD"
		},
		ENTER_NEW_PASSWORD: {
			"statusCode": HTTP_STATUS_CODE.ACCESS_FORBIDDEN,
			"type": "ENTER_NEW_PASSWORD"
		},
		SESSION_EXPIRED: {
			"statusCode": HTTP_STATUS_CODE.UNAUTHORIZED,
			"type": "SESSION_EXPIRED"
		},
		ERROR: (value, code = HTTP_STATUS_CODE.BAD_REQUEST) => {
			return {
				"statusCode": code,
				"message": value,
				"type": "ERROR"
			};
		},
		FIELD_REQUIRED: (value, lang = "en") => {
			return {
				"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
				"message": lang === "en" ? EN_FIELD_REQUIRED.replace(/{value}/g, value) : EN_FIELD_REQUIRED.replace(/{value}/g, value),
				"type": "FIELD_REQUIRED"
			};
		},
		SOMETHING_WENT_WRONG: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "SOMETHING_WENT_WRONG"
		},
		SERVER_IS_IN_MAINTENANCE: (lang = "en") => {
			return {
				"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
				"message": lang === "en" ? EN_SERVER_IS_IN_MAINTENANCE : EN_SERVER_IS_IN_MAINTENANCE,
				"type": "SERVER_IS_IN_MAINTENANCE"
			};
		},
		LINK_EXPIRED: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"message": EN_LINK_EXPIRED,
			"type": "LINK_EXPIRED"
		},
		EMAIL_NOT_REGISTERED: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "EMAIL_NOT_REGISTERED"
		},
		EMAIL_ALREADY_EXIST: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "EMAIL_ALREADY_EXIST"
		},
		USERNAME_ALREADY_TAKEN: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "USERNAME_ALREADY_TAKEN"
		},
		EMAIL_NOT_VERIFIED: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "EMAIL_ALREADY_EXIST_BUT_ACCOUNT_NOT_VERIFIED",
		},
		FOLLOWING_ALREADY_EXIST: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "FOLLOWING_ALREADY_EXIST"
		},
		FOLLOWING_NOT_FOUND: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "FOLLOWING_NOT_FOUND"
		},
		POST_NOT_FOUND: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "POST_NOT_FOUND"
		},
		INVALID_OLD_PASSWORD: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "INVALID_OLD_PASSWORD"
		},
		NEW_CONFIRM_PASSWORD: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "NEW_CONFIRM_PASSWORD"
		},
		OTP_EXPIRED: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "OTP_EXPIRED"
		},
		INVALID_OTP: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "INVALID_OTP"
		},
		// user specific
		USER_NOT_FOUND: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "USER_NOT_FOUND"
		},
		PROFILE_NOT_COMPLETED: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "PROFILE_NOT_COMPLETED"
		},
		USER_DOES_NOT_EXIST: {
			"statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
			"type": "USER_DOES_NOT_EXIST"
		},
		TOO_MANY_REQUESTS: {
			"statusCode": HTTP_STATUS_CODE.CONCURRENT_LIMITED_EXCEEDED,
			"type": "TOO MANY REQUEST, PLEASE TRY AGAIN LATER"
		},
		SERVICE_UNAVAILABLE: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.SHUTDOWN,
				"type": `SERVICE_UNAVAILABLE FOR ${data} SECONDS`
			}
		},
		// categories specific
		ALREADY_DELETED_COMMENT: {
			statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
			type: "COMMENT_ALREADY_DELETED"
		},
		LOGIN_FIRST: {
			statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
			type: "LOGIN_FIRST"
		},
		CANT_POST: {
			statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
			type: "CANT_POST"
		},
		CANT_SEND_NOTIFICATION: {
			statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
			type: "CANT_SEND_NOTIFICATION"
		},
		ALREADY_DELETED_POST: {
			statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
			type: "ALREADY_DELETED_POST"
		},
		CANT_REPORT_POST: {
			statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
			type: "CANT_REPORT_POST"
		},
		CANT_EDIT_COMMENT: {
			statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
			type: "CANT_EDIT_COMMENT"
		},
		CANT_DISLIKE_POST: {
			statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
			type: "CANT_DISLIKE_POST"
		},
		CANT_ADD_COMMENT: {
			statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
			type: "CANT_ADD_COMMENT"
		},
		CANT_DELETE_NOTIFICATION: {
			statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
			type: "CANT_DELETE_NOTIFICATION"
		},
		ALREADY_LIKED_POST: {
			statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
			type: "ALREADY_LIKED_POST"
		},
		CANT_FOLLOW_USER: {
			statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
			type: "CANT_FOLLOW_USER"
		},
		BAD_GATEWAY: {
			"statusCode": HTTP_STATUS_CODE.BAD_GATEWAY,
			"type": "BAD_GATEWAY"
		}
	},
	SUCCESS: {
		DEFAULT: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "DEFAULT"
		},
		DETAILS: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "DEFAULT",
				"data": data
			};
		},
		LIST: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "DEFAULT",
				data
			};
		},
		FEED: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "USER_FEED",
				data
			};
		},
		SEND_OTP: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "SEND_OTP"
		},
		MAIL_SENT: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "MAIL_SENT"
		},
		VERIFY_OTP: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "VERIFY_OTP",
				"data": data
			};
		},
		RESET_PASSWORD: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "RESET_PASSWORD"
		},
		MAKE_PUBLIC_SHIFT: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "MAKE_PUBLIC_SHIFT"
		},
		CHANGE_PASSWORD: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "CHANGE_PASSWORD"
		},
		EDIT_PROFILE: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "EDIT_PROFILE"
		},
		// admin specific
		LOGOUT: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "LOGOUT"
		},
		// notification specific
		NOTIFICATION_DELETED: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "NOTIFICATION_DELETED"
		},
		NOTIFICATION_SAVED: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "NOTIFICATION_SAVED"
		},
		// content specific
		ADD_FOLLOWING: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "ADD_FOLLOWING"
		},
		REMOVE_FOLLOWING: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "REMOVE_FOLLOWING"
		},
		DELETE_POST: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "DELETE_POST"
		},
		EDIT_CONTENT: {
			"statusCode": HTTP_STATUS_CODE.UPDATED,
			"type": "EDIT_CONTENT"
		},
		EDIT_COMMENT: {
			"statusCode": HTTP_STATUS_CODE.UPDATED,
			"type": "EDIT_COMMENT"
		},
		// user specific
		SIGNUP: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "SIGNUP",
				"data": data
			};
		},
		LOGIN: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "LOGIN",
				"data": data
			};
		},
		POST: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "POST_CREATED",
				"data": data
			};
		},
		USER_LOGOUT: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "USER_LOGOUT"
		},
		BLOCK_USER: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "BLOCK_USER"
		},
		REPORT_POST: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "REPORT_POST"
		},
		UNBLOCK_USER: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "UNBLOCK_USER"
		},
		EDIT_POST_DETAILS: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "EDIT_POST_DETAILS"
		},
		LIKE_POST: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "LIKE_POST"
		},
		UNLIKE_POST: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "UNLIKE_POST"
		},
		PROFILE_SETTINGS: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "PROFILE_SETTINGS"
		},
		PROFILE_IMAGE: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "PROFILE_IMAGE"
		},
		// category specific
		ADD_COMMENT: (data) => {
			return {
				"statusCode": HTTP_STATUS_CODE.OK,
				"type": "ADD_COMMENT",
				"data": data
			};
		},
		DELETE_COMMENT: {
			"statusCode": HTTP_STATUS_CODE.OK,
			"type": "DELETE_COMMENT"
		},
	}

};

const QUEUE_NAME = {
	PUSH_NOTIFIACTION_ANDROID: "-push-notification-android-v9",
};

const TEMPLATES = {
	EMAIL: {
		SUBJECT: {
			FORGOT_PASSWORD: "Reset Password Request",
			VERIFY_EMAIL: "Verify email address",
			VERIFY_ACCOUNT: "Verify Your Account",
		},
		FROM_MAIL: process.env["FROM_MAIL"]
	},
};

const MIME_TYPE = {
	XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	CSV1: "application/vnd.ms-excel",
	CSV2: "text/csv",
	CSV3: "data:text/csv;charset=utf-8,%EF%BB%BF",
	XLS: "application/vnd.ms-excel"
};

const REGEX = {
	EMAIL: /^\w+([.-]\w+)*@\w+([.-]\w+)*\.\w{2,5}$/i,
	URL: /^(https?|http|ftp|torrent|image|irc):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/i,
	PASSWORD: /(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=.*[@#$%^&+=])(?=[^0-9]*[0-9]).{6,16}/, // Minimum 6 characters, At least 1 lowercase alphabetical character, At least 1 uppercase alphabetical character, At least 1 numeric character, At least one special character
	MONGO_ID: /^[a-f\d]{24}$/i
};

const NOTIFICATION_TYPE = {
	LIKE: "LIKE",
	COMMENT: "COMMENT",
	REPORT_POST: "REPORT_POST",
	FOLLOW_USER: "FOLLOW_USER",
	EVENT: "1",

};

const TOKEN_TYPE = {
	USER_LOGIN: "USER_LOGIN", // login/signup
	FORGOTPASS_VERIFY: "FORGOT_PASSWORD"
};

const fileUploadExts = [
	".mp4", ".flv", ".mov", ".avi", ".wmv",
	".jpg", ".jpeg", ".png", ".gif", ".svg"
];





export {
	SWAGGER_DEFAULT_RESPONSE_MESSAGES,
	HTTP_STATUS_CODE,
	DB_MODEL_REF,
	STATUS,
	VALIDATION_CRITERIA,
	VALIDATION_MESSAGE,
	MESSAGES,
	MIME_TYPE,
	REGEX,
	NOTIFICATION_TYPE,
	TEMPLATES,
	TOKEN_TYPE,
	NOTIFICATION_MSG,
	fileUploadExts,
	NOTIFICATION_DATA,
	CATEGORIES_STAUS,
	NOTIFICATION_TITLE,
	MODULES,
	QUEUE_NAME
};