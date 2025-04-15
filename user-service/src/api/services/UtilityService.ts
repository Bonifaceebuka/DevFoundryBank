// @ts-ignore
import Chance from "chance";
import { env } from "../../env"
import { CharacterCasing } from "../enums/CharacterCasing";
import User from "../models/postgres/User";

const DEFAULT_CHARACTER_LENGTH = 12;
const chance = new Chance();


export default class UtilityService {


    public static generateRandomString(
        { length = DEFAULT_CHARACTER_LENGTH, 
            casing = CharacterCasing.LOWER, 
            numericOnly = false }: 
            { length?: number, casing?: "upper" | "lower", numericOnly?: boolean}
    ): string {
        if(length <= 0) return "";

        const randomString = chance.string({ length, casing, alpha: !numericOnly, numeric: true });
        return randomString;
    }

    // public static sanitizeUserObject(user: User): User|null {
    //     if(!user) return null;
    //     else{
    //         delete (user as any).password;
    //         delete user.pin;
    //         delete user.otp;
    //     }

    //     return user;
    // }
}