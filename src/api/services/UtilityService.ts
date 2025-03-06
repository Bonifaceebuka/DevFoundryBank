import bcrypt from "bcryptjs";
import Chance from "chance";
import jwt from "jsonwebtoken"
import { env } from "../../env"
import { CharacterCasing } from "../enums/CharacterCasing";
import User from "../models/postgres/User";


const DEFAULT_CHARACTER_LENGTH = 12;
const chance = new Chance();


export default class UtilityService {
    public static async hashString(input: string): Promise<string> {
        if(!input) return "";

        const salt = await bcrypt.genSalt(10);
        const hashedString = await bcrypt.hash(input, salt);

        return hashedString;
    }

    public static async compareHash(input: string, hash: string): Promise<boolean> {
        const isSame = await bcrypt.compare(input, hash);
        return isSame;
    }

    public static generateRandomString(
        { length = DEFAULT_CHARACTER_LENGTH, casing = CharacterCasing.LOWER, numericOnly = false }: 
        {length?: number, casing?: CharacterCasing, numericOnly?: boolean}
    ): string {
        if(length <= 0) return "";

        const randomString = chance.string({ length, casing, alpha: !numericOnly, numeric: true });
        return randomString;
    }

    public static sanitizeUserObject(user: User): User {
        if(!user) return null;

        delete user.password;
        delete user.pin;
        delete user.otp;

        return user;
    }

    /**
     * generateJWT
     */
    public static generateJWT(email: string, user_id: string) {
        const jwtData = {
            email, user_id
        }
        return jwt.sign({ jwtData }, env.jwtConfig.secret ,{
            expiresIn: '3600s',
            issuer: env.jwtConfig.secret,
            audience: email
        })
    }
}