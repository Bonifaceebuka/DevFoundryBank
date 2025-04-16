import { IsNumber, IsOptional, IsString, Min } from "class-validator";


export default class UpdateUserRequest {
    user_id!: string;
    
    @IsString({ message: "First name is required" })
        first_name!: string;

    @IsString({ message: "Last name is required" })
        last_name!: string;

    @IsString({ message: "Address is required" })
        address!: string;

    @IsString({ message: "Phone Number is required" })
        phoneNumber!: string;

    @IsOptional()
    @IsNumber({}, { message: "State/LGA selection is not valid" })
    @Min(1, { message: "State/LGA selection is not valid" })
        stateLgaId!: number;
}
