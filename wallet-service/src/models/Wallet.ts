import { Column, Entity } from "typeorm";
import { BaseModel } from "./base";

export enum WalletStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING = "pending",
    BANNED = "banned",
}

@Entity({ name: "wallets" })
export default class Wallet extends BaseModel {
    @Column()
    user_id!: string;

    @Column({type: 'decimal', precision: 10, scale:4, default: 0})
    balance!: string;

    @Column("enum", {enum: WalletStatus, default: WalletStatus.PENDING })
    status!: WalletStatus;

    @Column({nullable: true})
    transaction_pin?: string;
}