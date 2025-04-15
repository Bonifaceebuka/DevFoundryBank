import compression from "compression";
import cors from "cors";
import { Application, json, 
    Request, Response, 
    urlencoded } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import * as swaggerDocument from '../api/swagger/swagger.json';

import { env } from "../env";

import { logLoader } from "./logger";
import { mongoDBLoader } from "./mongodb";
import { postgresLoader } from "./postgres";
import { redisLoader } from "./redis";
import { RegisterRoutes } from "../api/routes/routes";
import { corsOptions } from "./cors";
import { listenForIncomingRabbitMQMessage } from "../api/queues/common_listeners";

// const { app: appInfo } = env;

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 50 // limit each IP to 50 requests per windowMs
});


// function getProtectedRoutes(): string[] {
//   const protectedRoutes: string[] = [];

//   for (const path in swaggerDocument.paths as any) {
//     for (const method in swaggerDocument.paths[path] as any) {
//       if (swaggerDocument.paths[path][method]?.security) {
//         protectedRoutes.push(path);
//       }
//     }
//   }

//   return protectedRoutes;
// }

// Expose protected routes dynamically
// app.get("/auth-rules", (req: Request, res: Response) => {
//   res.json({ protectedRoutes: getProtectedRoutes() });
// });

const expressConfig = async (app: Application): Promise<void> => {
    app.use(cors(corsOptions));
    app.use(limiter);
    app.use(compression());
    app.use(urlencoded({ extended: true }));
    app.use(json());
    
    app.use(helmet());
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"]
        }
    }));

    await logLoader();
    await postgresLoader();
    await mongoDBLoader();
    await listenForIncomingRabbitMQMessage();
    // await redisLoader();

    // app.use('/api',routes);

    // app.get("/", (req:any, res:any) => res.send(`${appInfo.displayName} - v${appInfo.version}`));
    RegisterRoutes(app);
};

export default expressConfig;