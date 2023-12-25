import { MESSAGES } from "../config";
import { RedisConnection } from "../utils";
const Jwt = require('hapi-auth-jwt2');
const SECRET_KEY = process.env.SECRET_KEY;


const plugin = {
    name: "jwt-authentication",
    version: '1.0.0',
    register: async function(server, options){
        await server.register(Jwt);

        server.auth.strategy('user', 'jwt', {
            key: SECRET_KEY,
            validate: async (decoded, request, h) =>{
                const sessionData = await RedisConnection.getKey(`${decoded.UserId}_${decoded.deviceId}`);
                const status = JSON.parse(sessionData);
                if(!status){
                    return MESSAGES.ERROR.LOGIN_FIRST;
                }
                else if(decoded.tokenType == "USER_LOGIN"){
                    request.data = decoded;
                    return {isValid: true};
                }
                else{
                    return {isValid: false};
                }
            },
            verifyOptions: {algorithms: ['HS256']},
        });


        server.auth.strategy('reset_pass', 'jwt', {
            key: SECRET_KEY,
            validate: async (decoded, request, h) =>{
                if(decoded.tokenType == "FORGOT_PASSWORD"){
                    request.data = decoded;
                    return {isValid: true};
                }
                else{
                    return {isValid: false};
                }
            },
            verifyOptions: {algorithms: ['HS256']},
        });

        // server.auth.default('user', 'reset_pass');
    }

        
}

export default plugin;