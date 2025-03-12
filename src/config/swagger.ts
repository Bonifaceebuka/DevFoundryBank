import swaggerJsdoc from "swagger-jsdoc";
import { env } from "../env";

const { app: appInfo } = env;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: appInfo.displayName,
            version: appInfo.version,
            description: `This is ${appInfo.displayName}' RESTful API documentations powered by with Swagger UI`,
            license:{
                name: appInfo.displayName,
                url: `${appInfo.url}:${appInfo.port }`
            }
        },
        servers:[{
            url: `${appInfo.url}:${appInfo.port}`
        }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['src/api/routes/**/*.ts'],
};

export const swaggerDocConfig = swaggerJsdoc(options);