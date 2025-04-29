import { Column, Entity, Index } from "typeorm";
import { BaseModel } from "./base";
import { TransactionKind, TransactionStatus, TransactionType } from "../common/enums";

@Entity({ name: "transactions" })
export default class WalletTransaction extends BaseModel {
    @Column()
    @Index()
    reference!: string;

    @Column()
    name!: string;

    @Column()
    user_id!: string;

    @Column({type: 'decimal', precision: 10, scale:2, default: 0})
    opening_balance!: string;

    @Column({type: 'decimal', precision: 10, scale:2, default: 0})
    new_balance!: string;

    @Column({
        type: "enum",
        enum: TransactionType,
    })
    @Index()
    type?: TransactionType;

    @Column({
        type: "enum",
        enum: TransactionType,
    })
    @Index()
    kind?: TransactionKind;

    @Column({
        type: "enum",
        enum: TransactionType,
    })
    @Index()
    status?: TransactionStatus;
}