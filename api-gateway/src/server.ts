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

dotenv.config();
const app = express();

async () => {
    await dbConnection;
}
const activeEnv = process.env.NODE_ENV;
var allowOrigins = []
const gatewayKey = CONFIGS.API_GATEWAY_PUBLIC_KEY as string;
var userService
var notificationService

switch (activeEnv) {
    case "production":

        break;
    case "local":
        userService = `http://localhost:2025/`
        notificationService = `http://localhost:2027/`
        break
    default:
        break;
}

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

app.use('/user', addNewRequestCredentials, createProxyMiddleware({
    target: userService, 
    changeOrigin: true,
    pathRewrite: {
        [`^/user`]: "",
    }
}));

app.use('/notifications', addNewRequestCredentials, createProxyMiddleware({
    target: notificationService,
    changeOrigin: true,
    pathRewrite: {
        [`^/notifications`]: "",
    }
}));

app.use('/', createProxyMiddleware({
    target: userService, 
    changeOrigin: true
}));

app.use(express.json());
app.use(errorHandlerMiddlware as express.ErrorRequestHandler)
app.listen(CONFIGS.SERVER_PORT, () => {
        console.log(`API GATEWAY is running on port ${CONFIGS.SERVER_PORT}`);
});
