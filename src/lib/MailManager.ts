"use strict";

import * as nodemailer from "nodemailer";
import { logger } from "./lib.logger";
import { SERVER, TEMPLATES } from "../config";


// using smtp
const transporter = nodemailer.createTransport({
    service: SERVER.MAIL.SMTP.SERVICE,
	host: SERVER.MAIL.SMTP.HOST,
	port: SERVER.MAIL.SMTP.PORT,
	secure: true, // use SSL
	//	requireTLS: true,
	auth: {
		user: SERVER.MAIL.SMTP.USER,
		pass: SERVER.MAIL.SMTP.PASSWORD
	}
});

export class MailManager {
	private fromEmail: string = TEMPLATES.EMAIL.FROM_MAIL;

	async sendMail(params) {
		const mailOptions = {
			from: `${SERVER.APP_NAME} <${this.fromEmail}>`, // sender email
			to: params.email, // list of receivers
			subject: params.subject, // Subject line
			html: params.content
		};

		return new Promise(function (resolve, reject) {
			return transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
                    logger.error("Error sending email: " + error);
					console.error("Error sending email:==============>", error);
				} else {
                    logger.info(`Mail Sent Successfully ${info.response}`);
					console.log("Message sent: " + info.response);
					resolve(true);
				}
			});
		});
	}

    async verifyUser(payload:any){
        const mailContent = `Please verify your Account with this OTP. \n\n OTP: ${payload.otp}`
        return await this.sendMail({
            "email": payload.email,
            "subject": TEMPLATES.EMAIL.SUBJECT.VERIFY_ACCOUNT,
            "content": mailContent
        })
    }

	async forgotPasswordMail(params) {
		const mailContent = `Your Forgot Password OTP is :- ${params.otp}`

		return await this.sendMail({
			"email": params.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.FORGOT_PASSWORD,
			"content": mailContent
		});
	}
}

export const mailManager = new MailManager();