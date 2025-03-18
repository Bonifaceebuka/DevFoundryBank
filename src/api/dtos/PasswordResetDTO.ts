import { IsString } from "class-validator";
import PasswordResetRequest from "../models/payload/requests/PasswordResetRequest";

export class PasswordResetResponseDTO {
    isSuccess!: boolean;
    message!: string;
}

export class PasswordResetRequestDTO extends PasswordResetRequest {}

export class SetNewPasswordRequestDTO {
    password_reset_token!: string;
    new_password?: string;
}