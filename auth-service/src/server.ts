import 'reflect-metadata';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { CONFIGS } from "./common/configs";
import { dbConnection } from "./common/configs/mongodb";
import { logRequest } from "./middlewares/requestHandler.middleware";
import { gatewayMiddleware } from "./middlewares/gatewayMiddleware";
import { rateLimitMiddleware } from "./middlewares/rateLimitMiddleware";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from 'fs';
import { join} from 'path';
import { RegisterRoutes } from "./swagger/routes/routes";
import { errorHandlerMiddlware } from './middlewares/errorHandlerMiddleware';
import { consumeRabbitMQMessages } from './queues/email/consumer';
const swaggerDocument = JSON.parse(
    readFileSync(join(process.cwd(), 'src/swagger/swagger.json'), 'utf-8')
);

dotenv.config();
const app = express();

async () => {
    await dbConnection;
}
consumeRabbitMQMessages().then((res)=>{}).catch((err)=>console.log({err}));
const corsOptions = {
    origin: "http://localhost:3000",
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Origin",
        "Accept",
        "X-Requested-With",
        "x-jwt-token",
        "x-jwt-refresh-token",
        "Content-Length",
        "Accept-Language",
        "Accept-Encoding",
        "Connection",
        "Access-Control-Allow-Origin"
    ],
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(rateLimitMiddleware)
app.use(logRequest)

// app.get("/", (req:any, res:any) => res.send(`Notification service is UP!`));
if (CONFIGS.NODE_ENV !== 'prod' && CONFIGS.NODE_ENV !== 'production'){
    app.use('/swagger/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
app.use(express.json());
RegisterRoutes(app);
app.use(gatewayMiddleware)
app.use(errorHandlerMiddlware as express.ErrorRequestHandler)
app.listen(CONFIGS.SERVER_PORT, () => {
    console.log(`Auth service is running on port ${CONFIGS.SERVER_PORT}`);
});
