import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Currency } from "../../enums/Currency";


@Entity({ name: "users_withdrawal_information" })
export default class UserWithdrawalInformation {
    @Column()
    @PrimaryGeneratedColumn()
        id?: number;
    
    @Column()
    @Index()
        userId!: string;
        
    @Column({
        type: "enum",
        enum: Currency,
        default: Currency.NGN
    })
    @Index()
        currency?: Currency;

    @Column()
        bankCode!: string;

    @Column()
        bankName!: string;

    @Column()
        accountNumber!: string;

    @Column()
        accountName!: string;

    @CreateDateColumn()
        createdAt?: string;
        
    @UpdateDateColumn()
        lastUpdatedAt?: Date;
}