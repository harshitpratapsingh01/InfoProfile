import { SERVER } from "../config";
import { createClient } from "redis";
import { logger } from "../lib";

class RedisClient {
    
    public client: any;
    constructor() {
        console.log("url",`redis://${SERVER.REDIS.HOST}:${SERVER.REDIS.PORT}`)
        logger.info(`Redis server listening on ${SERVER.REDIS.HOST}:${SERVER.REDIS.PORT}, in ${SERVER.REDIS.DB} DB`);
        this.client = createClient({
            socket: {
                host: SERVER.REDIS.HOST,
                port: parseInt(SERVER.REDIS.PORT)
            }
        });
        this.client.on("Error", (error: any) => console.log("redis error", error));
    }

    async connect() {
        await this.client.connect();
    }

    async setKey(key: any, value: any, option?: any) {
        await this.client.set(key, value, option);
    }

    async getKey(key: string): Promise<any> {
        return await this.client.get(key);
    }

    async ttl(key: string): Promise<number> {
        return await this.client.ttl(key);
    }

    async deleteKey(key) {
        return await this.client.del(key, function (error, reply) {
            if (error) {
                console.log(error);
            }
            console.log(reply)
            return reply;
        });
    }
}

export const RedisConnection = new RedisClient()
RedisConnection.connect();
