import { IsString, IsObject } from "class-validator";

export class SendMailDTO {
    @IsString()
    to!: string;

    @IsString()
    subject!: string;

    @IsString()
    template!: string;

    @IsObject()
    data!: Record<string, any>;
}
