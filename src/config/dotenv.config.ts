"use strict";

import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
dotenv.config();

const ENVIRONMENT = process.env.NODE_ENV.trim();
console.log(ENVIRONMENT);
switch (ENVIRONMENT) {
	case "dev":
	case "development": {
		if (fs.existsSync(path.join(process.cwd(), "/.env.development"))) {
			dotenv.config({ path: ".env.development" });
		} else {
			console.log("Unable to find Environment File");
			process.exit(1);
		}
		break;
	}
	case "qa": {
		if (fs.existsSync(path.join(process.cwd(), "/.env.qa"))) {
			dotenv.config({ path: ".env.qa" });
		} else {
			process.exit(1);
		}
		break;
	}
	case "stag":
	case "staging": {
		if (fs.existsSync(path.join(process.cwd(), "/.env.staging"))) {
			dotenv.config({ path: ".env.staging" });
		} else {
			process.exit(1);
		}
		break;
	}
	case "preprod": {
		if (fs.existsSync(path.join(process.cwd(), "/.env.preprod"))) {
			dotenv.config({ path: ".env.preprod" });
		} else {
			process.exit(1);
		}
		break;
	}
	case "prod":
	case "production": {
		if (fs.existsSync(path.join(process.cwd(), "/.env"))) {
			dotenv.config({ path: ".env" });
		} else {
			process.exit(1);
		}
		break;
	}
	case "default": {
		if (fs.existsSync(path.join(process.cwd(), "/.env.default"))) {
			dotenv.config({ path: ".env.default" });
		} else {
			process.exit(1);
		}
		break;
	}
	case "local": {
		if (fs.existsSync(path.join(process.cwd(), "/.env.local"))) {
			dotenv.config({ path: ".env.local" });
		} else {
			process.exit(1);
		}
		break;
	}
	default: {
		fs.existsSync(path.join(process.cwd(), "/.env.local")) ? dotenv.config({ path: ".env.local" }) : process.exit(1);
	}
}

export const SERVER = Object.freeze({
	APP_NAME: "InfoProfile",
    APP_URL: process.env["APP_URL"],
	API_BASE_URL: "/api",
	SECRET_KEY: process.env["SECRET_KEY"],
	UPLOAD_DIR: process.cwd() + "/src/uploads/",
	FCM_TOKEN: "fcm1001",

	TOKEN_INFO: {
		// LOGIN_EXPIRATION_TIME: "180d", // 180 days
		EXPIRATION_TIME: {
			USER_LOGIN: 180 * 24 * 60 * 60, // 180 days
			FORGOT_PASSWORD: "1h", // 10 mins
			VERIFY_EMAIL: 10 * 60 * 1000, // 10 mins
		},
		ISSUER: process.env["APP_URL"]
	},

	BASIC_AUTH: {
		NAME: "socialMedia",
		PASS: "social@123"
	},

    MONGO: {
		DB_NAME: process.env["DB_NAME"],
		DB_URL: process.env["DB_URL"],
		OPTIONS: {
			user: process.env["DB_USER"],
			pass: process.env["DB_PASSWORD"],
		},
		REPLICA: process.env["DB_REPLICA"],
		REPLICA_OPTION: {
			replicaSet: process.env["DB_REPLICA_SET"],
			authSource: process.env["DB_AUTH_SOURCE"],
			ssl: process.env["DB_SSL"]
		}
    },
	MAIL: {
		SMTP: {
			SERVICE: process.env["SMTP_SERVICE"],
			HOST: process.env["SMTP_HOST"],
			PORT: process.env["SMTP_PORT"],
			USER: process.env["SMTP_USER"],
			PASSWORD: process.env["SMTP_PASSWORD"]
		}
	},
	SALT_ROUNDS: 10,
    ENVIRONMENT: process.env["ENVIRONMENT"],
	IP: process.env["IP"],
	PORT: process.env["PORT"] || 4000,
	PROTOCOL: process.env["PROTOCOL"],

	REDIS: {
		HOST: process.env["REDIS_HOST"],
		PORT: process.env["REDIS_PORT"],
		DB: process.env["REDIS_DB"],
	},
	IS_RABBITMQ_DELAYED_ENABLE: false,

	RABBITMQ: {
		URL: "amqp://localhost",
		QUEUE_NAME: "Notification"
	},
	DEFAULT_PASSWORD: "String@123",
	DEFAULT_OTP: "1234"
})