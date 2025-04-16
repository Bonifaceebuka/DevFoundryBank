import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { DocumentType } from "../../enums/DocumentType";
import User from "./User";
import { BaseModel } from "./base";

export enum KYCStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING = "pending",
    BANNED = "banned",
}

export enum KYCTiers {
    TIER1 = "tier1",
    TIER2 = "tier2",
}

@Entity({ name: "users_kyc_information" })
export default class UserKYCInfomation extends BaseModel {
    @Column()
    user_id!: string;
    @OneToOne(() => User, (user)=>user.kyc)
    @JoinColumn({name: 'user_id', referencedColumnName: 'user_id'})

    @Column()
    first_name!: string;

    @Column({nullable: true})
    middle_name!: string;

    @Column()
    last_name!: string;

    @Column()
    date_of_birth!: Date;

    @Column()
    date_of_birth_submitted!: Date;

    @Column({
        type: "enum",
        enum: DocumentType
    })
    document_type?: DocumentType;

    @Column({
        type: "enum",
        enum: KYCTiers
    })
    tier!: KYCTiers;

    @Column()
    document_id!: string;

    @Column("enum", {enum: KYCStatus, default: KYCStatus.PENDING })
    status!: KYCStatus;
}