import { CharacterCasing } from "../common/constants/enums";
import Chance from "chance";
import bcrypt from "bcryptjs";

const DEFAULT_CHARACTER_LENGTH = 12;
const chance = new Chance();
   export function generateRandomString(
        {
            length = DEFAULT_CHARACTER_LENGTH,
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