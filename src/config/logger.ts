import { config, configure, format, transports } from "winston";
import { env } from "../env";
import DailyRotateFile from "winston-daily-rotate-file";
import { hostname } from "os";

const { combine, colorize, errors, timestamp, printf } = format;


export const logLoader = () => {
    configure({
        levels: config.syslog.levels,
        level: env.log.level,
        format: combine(
            errors({ stack: true }),
            colorize({ all: true }),
            timestamp({ format: "YYYY-MM-DD HH:mm:ss"}),
            printf(info =>{
                return `${info.timestamp} [${info.level}] [${info.context ? info.context : info.stack}]${info.message ||JSON.stringify({
                            ...info,
                            timestamp: undefined,
                            context: undefined,
                            stack: undefined,
                            level: undefined,
                        })}`
            })
            
        ),
        transports: [
            new transports.Console(),
            new DailyRotateFile({
                dirname: `logs/${hostname}/combined`,
                filename: "combined",
                extension: ".log",
                level: env.isProduction ? "info" : "debug"
            }),
            new DailyRotateFile({
                dirname: `logs/${hostname}/error`,
                filename: "errors",
                extension: ".log",
                level: "error",
                format: combine(errors({stack: !env.isProduction}))
            })
        ]
    });
};