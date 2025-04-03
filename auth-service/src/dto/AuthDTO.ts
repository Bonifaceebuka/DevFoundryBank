import { IUser } from './../models/User';
import { IsOptional, IsString, IsStrongPassword } from "class-validator";

export class AuthUserDataDTO {
    @IsString({ message: "Email must be string" })
    authEmail!: string;

    @IsString({ message: "User ID must be string" })
    authId!: string;
}

export class AuthUserDTO {
    @IsString({ message: "Email is required" })
    email!: string;

    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }, { message: "Password should be a minimum of 8 characters, with at least 1 uppercase, 1 lowercase, 1 number and 1 special character" })
    password!: string;
}


export class RegisterUserResponseDTO { 
    @IsString()
     itExists!: boolean;

    @IsOptional()
    user?: IUser|undefined|null;

    @IsOptional()
    message?: string | undefined
}

export default class EmailVerificationDTO {
    @IsString({ message: "Email is required" })
    email!: string;

    @IsString({ message: "Otp is required" })
    otp!: string;
}


export class LoginUserResponseDTO {
    @IsString()
    isSuccess!: boolean;

    user?: IUser|null;

    @IsString()
    token?: string|undefined|null;

    @IsString()
    message?: string
}


export class EmailVerificationResponseDTO {
    @IsString()
    isSuccess!: boolean;

    @IsString()
    message?: string
}