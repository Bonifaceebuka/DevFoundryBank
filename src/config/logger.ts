import { config, configure, format, transports } from "winston";

import { env } from "../env";


const { combine, colorize, simple, errors } = format;


export const logLoader = () => {
    configure({
        levels: config.syslog.levels,
        level: env.log.level,
        format: combine(
            errors({ stack: true }),
            colorize({ all: true }),
            simple()
        ),
        transports: [
            new transports.Console(),
        ]
    });
};