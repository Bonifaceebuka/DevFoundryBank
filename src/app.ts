import express from "express";
import expressConfig from "./config/express";
import { env } from "./env";
import { Logger } from "./lib/logger"
import swaggerUi from "swagger-ui-express";
import { swaggerDocConfig } from "./config/swagger"

const logger = new Logger();

(async () => {
    const { app: appInfo } = env;

    const app: express.Application = express();
    app.use('/swagger/api', swaggerUi.serve, swaggerUi.setup(swaggerDocConfig));
    await expressConfig(app);
    
    app.listen(appInfo.port, () => {
        logger.info(`${appInfo.displayName}, v${appInfo.version} is started on port ${appInfo.port}`);
        logger.info(`${appInfo.displayName}, v${appInfo.version} is started on port ${appInfo.port}`);
        logger.info(`Swagger Doc is available at, ${ appInfo.url }: ${ appInfo.port }/swagger/api`);
    });
})();