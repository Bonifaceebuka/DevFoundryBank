import { IsString } from "class-validator";


export default class AuthenticateUserOtp {
    @IsString({ message: "Email is required" })
        email!: string;

    @IsString({ message: "Otp is required" })
        otp!: string;
}
