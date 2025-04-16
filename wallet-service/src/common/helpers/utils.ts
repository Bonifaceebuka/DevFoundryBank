import { CharacterCasing } from "../constants/enums";
import Chance from "chance";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { CONFIGS } from "../configs";
import { uuid } from "uuidv4";
import moment  from "moment"

const chance = new Chance();
   export function generateRandomString(
        {
           length = CONFIGS.DEFAULT_CHARACTER_LENGTH,
            casing = CharacterCasing.LOWER,
            numericOnly = false
        }:
        { length?: number, casing?: "upper" | "lower", numericOnly?: boolean }
    ): string {
    if (length <= 0) return "";

    const randomString = chance.string({ length, casing, alpha: !numericOnly, numeric: true });
    return randomString;
}

    export async function hashString(input: string): Promise < string > {
    if(!input) return "";

    const salt = await bcrypt.genSalt(10);
    const hashedString = await bcrypt.hash(input, salt);

    return hashedString;
}

   export async function compareHash(input: string, hash: string): Promise < boolean > {
    const isSame = await bcrypt.compare(input, hash);
    return isSame;
}

    /**
     * generateJWT
     */
    export function generateJWT(email: string, user_id: string) {
        const jwtData = {
            email, 
            user_id
        }
        return jwt.sign({ jwtData }, CONFIGS.JWT_TOKEN.JWT_SECRET, {
            expiresIn: '3600s',
            issuer: CONFIGS.JWT_TOKEN.JWT_ISSUER,
            audience: email
        });
    }

    export function generateUUID() {
        const currentTime = moment();
        const lifeSpan = 24
        const expiresAt = currentTime.add(lifeSpan,'hours').format() as unknown as Date;
        return {
            uuid: uuid(),
            expiresAt
        }
    }


    export function hasExpired(expectedExpirationDate: any){
        const currentTime = moment();
        if(currentTime.isAfter(expectedExpirationDate)){
            return true;
        }
        return false
    }