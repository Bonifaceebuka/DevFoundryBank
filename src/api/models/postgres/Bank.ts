import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

import { Currency } from "../../enums/Currency";


@Entity({ name: "banks" })
export default class Bank {
    @Column()
    @PrimaryGeneratedColumn()
        id?: number;

    @Column()
    @Index()
        code: string;

    @Column()
    @Index()
        name: string;

    @Column({
        type: "enum",
        enum: Currency,
        default: Currency.NGN
    })
    @Index()
        currency?: Currency;

    @CreateDateColumn()
        createdAt?: string;
}