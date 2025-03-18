import { IsOptional, IsString } from "class-validator";
import CreateUserRequest from "../models/payload/requests/CreateUserRequest";
import User from "../models/postgres/User";
import AuthenticateUserRequest from "../models/payload/requests/AuthenticateUserRequest";
import AuthenticateUserOtp from "../models/payload/requests/AuthenticateUserOtp";

export class AuthUserDataDTO {
    @IsString({ message: "Email must be string" })
    authEmail!: string;

    @IsString({ message: "User ID must be string" })
    authId!: string;
}

export class RegisterUserDTO extends AuthenticateUserRequest { }

export class RegisterUserResponseDTO { 
    @IsString()
     itExists!: boolean;

    @IsOptional()
    user?: User|undefined;

    @IsOptional()
    message?: string | undefined
}

export class LoginUserDTO extends AuthenticateUserRequest { }

export class LoginUserResponseDTO {
    @IsString()
    isSuccess!: boolean;

    user?: User|null;

    @IsString()
    token?: string|undefined|null;

    @IsString()
    message?: string
}

export class EmailVerificationDTO extends AuthenticateUserOtp { }

export class EmailVerificationResponseDTO {
    @IsString()
    isSuccess!: boolean;

    @IsString()
    message?: string
}