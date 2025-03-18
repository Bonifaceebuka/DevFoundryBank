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
                const { level, timestamp, message, context, stack, activity_type, metadata } = info;
                console.log({message})
                const extraData = metadata ? (typeof metadata === "object" ? JSON.stringify(metadata, null, 2) : metadata) : null;
                return `${timestamp} [${level}] [${context || stack}] ${message || null} ${activity_type ? `[Activity Type: ${activity_type}]` : `[Activity Type: ${null}]`} ${extraData ? `[Metadata: ${extraData}]` : `[Metadata: ${null}]`}`;
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