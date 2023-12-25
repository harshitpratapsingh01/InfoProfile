"use strict";

import hapi from "@hapi/hapi";
import { dbConnection } from "./src/utils/Database";
import { plugins } from "./src/plugins/swagger"
import { routes } from "./src/routes";
import { SERVER } from "./src/config";
import { RedisConnection } from "./src/utils";
// import { messageQueue } from "./src/utils";
import { rabbitMQ } from "./src/utils";


class Init {
    static async hapiserver() {
        const server = hapi.server({
            port: SERVER.PORT,
        });

        await dbConnection.connectToDb();
        await RedisConnection;

        await rabbitMQ.init();
        
        await server.register(plugins);

        server.route(routes);
        await server.start();
        console.log(`Hapi server listening on ${SERVER.PROTOCOL}://${SERVER.IP}:${SERVER.PORT}/documentation, in ${SERVER.ENVIRONMENT} mode`);
    }
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

Init.hapiserver();