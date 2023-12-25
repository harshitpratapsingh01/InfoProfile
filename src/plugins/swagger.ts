import plugin from './jwt.plugin';
import * as Inert from '@hapi/inert';
import * as Vision from '@hapi/vision';
import * as HapiSwagger from 'hapi-swagger';

export const plugins = [
    {
        plugin,
    },
    Inert,
    Vision,
    {
        plugin: HapiSwagger,
        options: {
            info: {
                title: 'API Documentation',
                version: '1.0.0',
            },
            securityDefinitions: {
                apiKey: {
                  type: 'apiKey',
                  name: 'Authorization',
                  in: 'header'
                },
                basicAuth: {
                    type: "basic",
                },
            },
            security: [{ apiKey: [] }, {basicAuth: [] }],
            grouping:'tags',
            tags: [
                { name: 'user', description: 'user based apis' },
                { name: 'post', description: 'post based apis' },
                { name: 'profile', description: 'users profile based apis' },
                { name: 'notification', description: 'notification based apis' }
                // { name: 'common', description: 'upload image common apis' }

            ],
            documentationPath: '/documentation', 
        },
    },
];