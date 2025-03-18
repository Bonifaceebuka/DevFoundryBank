import { IsString } from "class-validator";

export class CreatePinDTO { 
    user_id?: number;

    @IsString()
    pin!: string 
}

export class CreatePinResponseDTO {
    isSuccess!: boolean;
    message?: string
}
