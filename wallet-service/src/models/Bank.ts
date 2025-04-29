import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { BaseModel } from "./base";
import { Currency } from "../common/enums";

@Entity({ name: "banks" })
export default class Bank extends BaseModel {
    @Column()
    @Index()
        code!: string;

    @Column()
    @Index()
        name!: string;

    @Column({
        type: "enum",
        enum: Currency,
        default: Currency.NGN
    })
    @Index()
        currency?: Currency;
}