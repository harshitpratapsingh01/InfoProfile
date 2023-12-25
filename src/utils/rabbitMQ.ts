"use strict";

const amqp = require("amqplib/callback_api");
import { QUEUE_NAME, SERVER } from "../config";
import { logger } from "../lib";
import { sendPushNotification } from "../lib";

let amqpConn = null;
let offlinePubQueue = [];
let pubChannel = null;
const exchange = SERVER.IS_RABBITMQ_DELAYED_ENABLE ? "my-delay-exchange" : "";
const queueName = SERVER.RABBITMQ.QUEUE_NAME;

class RabbitMQ {

	// if the connection is closed or fails to be established at all, we will reconnect
	init() {
		amqp.connect(SERVER.RABBITMQ.URL + "?heartbeat=60", (error, connection) => {
			if (error) {
				console.error("[AMQP]", error.message);
				logger.error("Error in [AMQP] ===>>", error.message);
				return setTimeout(() => this.init(), 1000);
			}
			connection.on("error", function (error) {
				if (error.message !== "Connection closing") {
					console.error("[AMQP] conn error", error.message);
				}
			});
			connection.on("close", () => {
				console.error("[AMQP] reconnecting");
				return setTimeout(() => this.init(), 1000);
			});

			console.log("[AMQP] connected");
			logger.info(`[AMQP] connected ==========>>>${SERVER.RABBITMQ.URL}`);
			amqpConn = connection;

			this.startPublisher();
		});
	}

	closeOnError(error) {
		if (!error) return false;
		console.error("[AMQP] error", error);
		amqpConn.close();
		return true;
	}

	// Publisher
	startPublisher() {
		amqpConn.createConfirmChannel((error, channel) => {
			if (this.closeOnError(error)) return;
			channel.on("error", function (error) {
				console.error("[AMQP] channel error", error.message);
			});
			channel.on("close", function () {
				console.log("[AMQP] channel closed");
			});

			pubChannel = channel;

			if (SERVER.IS_RABBITMQ_DELAYED_ENABLE) {
				// assert the exchange: 'my-delay-exchange' to be a x - delayed - message,
				pubChannel.assertExchange(exchange, "x-delayed-message", { autoDelete: false, durable: true, passive: true, arguments: { "x-delayed-type": "direct" } });
				// Bind the queue: "jobs" to the exchnage: "my-delay-exchange" with the binding key "jobs"
				pubChannel.bindQueue(queueName, exchange, queueName);
			}


			channel.assertQueue(queueName + QUEUE_NAME.PUSH_NOTIFIACTION_ANDROID, {
				durable: true
			});
			channel.assertQueue(queueName, {
				durable: true
			});
			this.startConsumer();
			channel.prefetch(1);

			while (true) {
				var m = offlinePubQueue.shift();
				if (!m) break;
				this._publish(m[0], m[1], m[2]);
			}
		});
	}

	// method to publish a message, will queue messages internally if the connection is down and resend later
	_publish(routingKey, content, delay = 0) {
		try {
			let headers = {};
			if (SERVER.IS_RABBITMQ_DELAYED_ENABLE) {
				headers = { headers: { "x-delay": delay }, persistent: true }
			} else {
				headers = { persistent: true };
			}
			pubChannel.publish(exchange, routingKey, content, headers, function (error, ok) {
				if (error) {
					console.error("[AMQP] publish", error);
					offlinePubQueue.push([exchange, routingKey, content]);
					pubChannel.connection.close();
				}
			});
		} catch (error) {
			console.error("[AMQP] failed", error.message);
			offlinePubQueue.push([exchange, routingKey, content]);
		}
	}

	// A consumer that acks messages only if processed succesfully
	startConsumer() {
		amqpConn.createChannel((error, channel) => {
			if (this.closeOnError(error)) return;
			channel.on("error", function (error) {
				console.error("[AMQP] channel error", error.message);
			});
			channel.on("close", function () {
				console.log("[AMQP] channel closed");
			});

			channel.consume(queueName + QUEUE_NAME.PUSH_NOTIFIACTION_ANDROID, async (message) => {
				try {
					const data  = JSON.parse(message.content.toString());
					sendPushNotification(data.userId, data.message);
					channel.ack(message);
				} catch (error) {
					this.closeOnError(error);
				}
			}, { noAck: false });

			channel.consume(queueName, processMsg, { noAck: false });

			function processMsg(message) {
				listenJobs(message, (ok) => {
					try {
						if (ok)
							channel.ack(message);
						else
							channel.reject(message, true);
					} catch (error) {
						this.closeOnError(error);
					}
				});
			}

			const listenJobs = async (msg, callback) => {
				msg = JSON.parse(msg.content.toString());
				const jobName = msg.queueName;
				const data = msg.data;
				console.log("listenJobs===========================>", jobName, data);
				callback(true);
			}
		});
	}

	pushNotificationAndroid(data) {
		const msg = JSON.stringify(data);
		this._publish(queueName + QUEUE_NAME.PUSH_NOTIFIACTION_ANDROID, Buffer.from(msg));
	}
}

export const rabbitMQ = new RabbitMQ();


// class MessageQueue {
//     async sendToQueue(queue: any, data: any) {
//         const connection = await amqp.connect(SERVER.RABBITMQ.URL);
//         const channel = await connection.createChannel();
//         const queueName = queue;
//         await channel.assertQueue(queueName, { durable: true });
//         channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
//         await channel.close();
//         await connection.close();
//     }

//     async startConsumer() {
//         const connection = await amqp.connect(SERVER.RABBITMQ.URL);
//         const channel = await connection.createChannel();
//         const queueName = QUEUE_NAME.PUSH_NOTIFIACTION_ANDROID;
//         await channel.assertQueue(queueName, { durable: true });
//         console.log("connected")
//         channel.consume(queueName, async (message) => {
//             const data = JSON.parse(message.content.toString());
//             await sendPushNotification(data.userId,data.message)
//             console.log("consumer data",data)
//             channel.ack(message);
//         });
//     }
// }

// export const messageQueue = new MessageQueue();