import { Service } from "typedi";
import winston from "winston";
import { CONFIGS } from "..";

type LogDataFormat = {
    activity_type: string;
    message: string|undefined;
    metadata: object;
};

@Service()
export class Logger {
    private readonly context: string;

    constructor(context?: string) {
        this.context = context || "Root";
    }

    public debug(logData: string | LogDataFormat, ...args: any[]): void {
        this.log("debug", logData, args);
    }

    public info(logData: string | LogDataFormat, ...args: any[]): void {
        this.log("info", logData, args);
    }

    public warn(logData: string | LogDataFormat, ...args: any[]): void {
        this.log("warn", logData, args);
    }

    public error(logData: string | LogDataFormat, ...args: any[]): void {
        this.log("error", logData, args);
    }

    public log(level: string, logData: string | LogDataFormat, args: any): void {
         let logBody = null;

        if (typeof logData == "string") {
            logBody={
                message: `${this.formatScope()} ${logData}`,
                context: this.context,
                metadata: args.length ? JSON.stringify(args) : null
            }
        }
        else{
            logBody = {
                message: `${this.formatScope()} ${logData.message}`,
                context: this.context,
                activity_type: logData.activity_type,
                metadata: logData.metadata,
            }
        }

        if (winston) {
            winston.log(level, logBody.message, logBody);
        }
    }

    private formatScope(): string {
        return `[${CONFIGS.APP_NAME}]`;
    }
}