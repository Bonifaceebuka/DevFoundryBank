import { IsString } from "class-validator";
import User from "../models/postgres/User";

export class FetchProfileResponseDTO { 
    user?: User|null;

    @IsString()
    message ?: string 
}


export class UpdateProfileResponseDTO {
    isSuccess!: boolean;
    message?: string;
    user?: User|null
}
