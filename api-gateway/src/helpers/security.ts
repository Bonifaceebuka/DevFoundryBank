import crypto from "crypto";
import { CONFIGS } from "../common/config.js";
import { AppError } from "../common/AppError.js";

export function generateSignature(apiKey: string, timestamp: string): string {
    return crypto.createHmac("sha256", apiKey).update(timestamp).digest("hex");
}

export async function verifySignature(validApiKey: string, timestamp: string, signature: string): Promise<boolean> {
    const decryptedSignature = generateSignature(validApiKey, timestamp);

    if (signature !== decryptedSignature) {
        console.log(`Invalid Signature: found: ${decryptedSignature}`)
        throw new AppError("Unauthorized access!", 403);
    }

    const expiresAt = CONFIGS.API_KEY_EXPIRES_AT;
    const sentTimestamp = Number(timestamp);
    const sentDate = new Date(sentTimestamp)
    const lifeSpan = expiresAt * 60 * 60 * 1000; 
    const hasExpired = Date.now() - sentTimestamp > lifeSpan;
    if (hasExpired) {
        console.log(`Timestamp has expired at: ${sentDate}`)
        throw new AppError("Unauthorized access!", 403);
    }

    return true
}

export async function issueNewSignature(serviceApiKey: string): Promise<{timestamp:string, signature: string}> {
    const newTimestamp = Date.now().toString();
    const newSignature = crypto.createHmac("sha256", serviceApiKey).update(newTimestamp).digest("hex");
    return {
        timestamp: newTimestamp,
        signature: newSignature
    }
}