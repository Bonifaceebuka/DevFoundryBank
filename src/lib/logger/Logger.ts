import { Service } from "typedi";
import winston from "winston";

import { env } from "../../env";


@Service()
export class Logger {
    public debug(message: string, ...args: any[]): void {
        this.log("debug", message, args);
    }

    public info(message: string, ...args: any[]): void {
        this.log("info", message, args);
    }

    public warn(message: string, ...args: any[]): void {
        this.log("warn", message, args);
    }

    public error(message: string, ...args: any[]): void {
        this.log("error", message, args);
    }

    public log(level: string, message: string, args: any[] = []): void {
        if (winston) {
            winston[level](`${this.formatScope()} ${message}`, ...args);
        }
    }

    private formatScope(): string {
        return `[${env.app.name} v${env.app.version}]`;
    }
}