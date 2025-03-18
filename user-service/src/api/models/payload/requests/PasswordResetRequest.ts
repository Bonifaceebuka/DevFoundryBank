import { IsString } from "class-validator";


export default class PasswordResetRequest {    
    @IsString({ message: "Email is required" })
    email!: string;
}
