import { join } from "path";


const delimiter = ",";
const environmentPaths: Record<string, string> = {
    production: "dist",
    staging: "dist",
    development: "dist",
    dev: "dist",
    prod: "dist",
    local: "dist",
};


export function getOsEnv(key: string): string {
    if (typeof process.env[key] === "undefined") {
        throw new Error(`Environment variable ${key} is not set.`);
    }

    return process.env[key].toString();
}

export function getOsEnvWithDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}

export function getOsEnvOptional(key: string): string | undefined {
    return process.env[key];
}

export function getPath(path: string): string {
    const environment = process.env.NODE_ENV || "local";
    const outputDir = environmentPaths[environment] || "src";

    if (outputDir === "src") {
        return join(process.cwd(), path);
    } else {
        return join(process.cwd(), path.replace("src/", "dist/").slice(0, -3) + ".js");
    }
}

export function getPaths(paths: string[]): string[] {
    return paths.map(p => getPath(p));
}

export function getOsPath(key: string): string {
    return getPath(getOsEnv(key));
}

export function getOsPathWithDefault(key: string, defaultValue: string): string {
    if (process.env[key]) {
        return getPath(getOsEnv(key));
    } else {
        return getPath(defaultValue);
    }
}

export function getOsPaths(key: string): string[] {
    return getPaths(getOsEnvArray(key));
}

export function getOsPathsWithDefault(key: string, defaultValue: string): string[] {
    if (process.env[key]) {
        return getPaths(getOsEnvArray(key));
    } else {
        return getPaths(defaultValue.split(delimiter));
    }
}

export function getOsEnvArray(key: string): string[] {
    return process.env[key] && process.env[key].split(delimiter) || [];
}

export function toNumber(value: string): number {
    return parseInt(value, 10);
}

export function toBool(value: string): boolean {
    return value === "true";
}

export function normalizePort(port: string): number | string | boolean | undefined {
    if (port === undefined) { return undefined; }
    const parsedPort = parseInt(port, 10);
    if (isNaN(parsedPort)) { // named pipe
        return port;
    }
    if (parsedPort >= 0) { // port number
        return parsedPort;
    }
    return false;
}