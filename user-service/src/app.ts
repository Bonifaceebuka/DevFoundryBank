import "reflect-metadata"; 
import express from "express";
import expressConfig from "./config/express";
import { env } from "./env";
import { Logger } from "./lib/logger"
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from './api/swagger/swagger.json';
import { errorHandlerMiddlware } from "./api/middlewares/errorHandlerMiddleware";
import { gatewayMiddleware } from "./api/middlewares/gatewayMiddleware";
const logger = new Logger();

(async () => {
    const { app: appInfo } = env;

    const app: express.Application = express();
    app.use(gatewayMiddleware);
    app.use('/swagger/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    await expressConfig(app);
    app.use(errorHandlerMiddlware as express.ErrorRequestHandler)
    app.listen(appInfo.port, () => {
        logger.info(`${appInfo.displayName}, v${appInfo.version} is started on port ${appInfo.port}`);
        logger.info(`${appInfo.displayName}, v${appInfo.version} is started on port ${appInfo.port}`);
        logger.info(`Swagger Doc is available at, ${ appInfo.url }: ${ appInfo.port }/swagger/api`);
    });
})();