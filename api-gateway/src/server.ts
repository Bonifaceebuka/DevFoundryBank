import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from 'http-proxy-middleware';
import { CONFIGS } from "./common/config.js";

dotenv.config();
const app = express();
const activeEnv = process.env.NODE_ENV;
var allowOrigins = []

const preFetch = (req: Request, res: Response, next: NextFunction) => {
    console.log({ req })
    console.log('request to instance 1')
    next()
}


var userService
var activeVerison = "/api/"

switch (activeEnv) {
    case "production":

        break;
    case "local":
        userService = `http://localhost:2025/`
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
app.use('/user', preFetch, createProxyMiddleware({
    target: userService, 
    changeOrigin: true,
    pathRewrite: {
        [`^/user`]: "",
    },
}));

app.use('/', createProxyMiddleware({
    target: userService, changeOrigin: true
}));

app.use(express.json());

app.listen(CONFIGS.SERVER_PORT, () => {
        console.log(`API GATEWAY is running on port ${CONFIGS.SERVER_PORT}`);
});
