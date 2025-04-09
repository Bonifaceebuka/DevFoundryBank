import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from 'http-proxy-middleware';
import { CONFIGS } from "./common/config.js";
import { dbConnection } from "./common/mongodb.js";
import { logRequest } from "./middlewares/requestHandler.middleware.js";
import { gatewayMiddleware } from "./middlewares/gatewayMiddleware.js";
import { issueNewSignature } from "./helpers/security.js";
import { Request, Response, NextFunction } from "express";
import { rateLimitMiddleware } from "./middlewares/rateLimitMiddleware.js";
import { errorHandlerMiddlware } from "./middlewares/errorHandlerMiddleware.js";
import { corsOptions, SERVICES } from "./common/cors.js";

dotenv.config();
const app = express();
const serviceRoutes = SERVICES;

async () => {
    await dbConnection;
}

const gatewayKey = CONFIGS.API_GATEWAY_PUBLIC_KEY as string;

app.use(cors(corsOptions));
app.use(gatewayMiddleware)
app.use(rateLimitMiddleware)
app.use(logRequest)

const addNewRequestCredentials = async(req: Request, res: Response, next: NextFunction)=>{
    const { timestamp, signature } = await issueNewSignature(gatewayKey)
    req.headers["x-api-gateway-timestamp"] = timestamp
    req.headers["x-api-gateway-signature"] = signature
    req.headers["x-api-gateway-key"] = gatewayKey
    next();
}

Object.entries(serviceRoutes).forEach(([prefix, config]) => {
    app.use(`/${prefix}`, addNewRequestCredentials, createProxyMiddleware({
        target: config.target,
        changeOrigin: config.changeOrigin,
        pathRewrite: {
        [`^/${prefix}`]: config.basePath,
        },
    }));
});

app.use(express.json());
app.use(errorHandlerMiddlware as express.ErrorRequestHandler)
app.listen(CONFIGS.SERVER_PORT, () => {
    console.log(`API GATEWAY is running on port ${CONFIGS.SERVER_PORT}`);
});
