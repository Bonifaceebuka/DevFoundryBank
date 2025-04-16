import { IsString } from "class-validator";

export class CommonResponseDTO {
    isSuccess!: boolean;
    message!: string;
}

export default class OnlyEmailDTO {    
    @IsString({ message: "Email is required" })
    email!: string;
}

export interface CustomApiResponse{
    message: string;
    data?: any, 
    status_code: number;
    }
