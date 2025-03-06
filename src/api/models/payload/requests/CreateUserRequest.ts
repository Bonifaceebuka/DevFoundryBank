import { IsEmail, IsNumber, IsString, IsStrongPassword, Min } from "class-validator";


export default class CreateUserRequest {
    @IsString({ message: "First name is required" })
        firstName: string;

    @IsString({ message: "Last name is required" })
        lastName: string;

    @IsString({ message: "Email is required" })
    @IsEmail({}, { message: "Email must be a valid email address" })
        email: string;

    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }, { message: "Password should be a minimum of 8 characters, with at least 1 uppercase, 1 lowercase, 1 number and 1 special character" })
        password: string;

    @IsString({ message: "Address is required" })
        address: string;

    @IsString({ message: "Phone Number is required" })
        phoneNumber: string;

    @IsNumber({}, { message: "State/LGA selection is not valid" })
    @Min(1, { message: "State/LGA selection is not valid" })
        stateLgaId: number;
}
