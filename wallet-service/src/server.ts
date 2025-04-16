import 'reflect-metadata';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { CONFIGS } from "./common/configs";
import { logRequest } from "./middlewares/requestHandler.middleware";
import { gatewayMiddleware } from "./middlewares/gatewayMiddleware";
import { rateLimitMiddleware } from "./middlewares/rateLimitMiddleware";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from 'fs';
import { join} from 'path';
import { RegisterRoutes } from "./swagger/routes/routes";
import { errorHandlerMiddlware } from './middlewares/errorHandlerMiddleware';
import { consumeRabbitMQMessages } from './queues/email/consumer';
import { corsOptions } from './common/configs/cors';
import { postgresLoader } from './common/configs/postgres';
const swaggerDocument = JSON.parse(
    readFileSync(join(process.cwd(), 'src/swagger/swagger.json'), 'utf-8')
);

dotenv.config();
const app = express();

postgresLoader()
.then((res: any)=>{
    // console.log({res})
})
.catch((err: any)=>{
    console.log("✅ Connected to PostgreSQL database with message: ", err.message)
})

consumeRabbitMQMessages().then((res)=>{}).catch((err)=>console.log({err}));

app.use(cors(corsOptions));
app.use(rateLimitMiddleware)
app.use(logRequest)

app.get("/", (req:any, res:any) => res.send(`Wallet service is UP!`));
if (CONFIGS.NODE_ENV !== 'prod' && CONFIGS.NODE_ENV !== 'production'){
    app.use('/swagger/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
app.use(express.json());
RegisterRoutes(app);
app.use(gatewayMiddleware)
app.use(errorHandlerMiddlware as express.ErrorRequestHandler)
app.listen(CONFIGS.SERVER_PORT, () => {
    console.log(`Wallet service is running on port ${CONFIGS.SERVER_PORT}`);
});
