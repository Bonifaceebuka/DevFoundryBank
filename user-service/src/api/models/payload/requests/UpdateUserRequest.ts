import { IsNumber, IsOptional, IsString, Min } from "class-validator";


export default class UpdateUserRequest {
    id!: string;
    
    @IsString({ message: "First name is required" })
        firstName!: string;

    @IsString({ message: "Last name is required" })
        lastName!: string;

    @IsString({ message: "Address is required" })
        address!: string;

    @IsString({ message: "Phone Number is required" })
        phoneNumber!: string;

    @IsOptional()
    @IsNumber({}, { message: "State/LGA selection is not valid" })
    @Min(1, { message: "State/LGA selection is not valid" })
        stateLgaId!: number;
}
