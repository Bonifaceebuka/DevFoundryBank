import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

import StateLGA from "./StateLGA";
import { BaseModel } from "./base";
import UserKYCInfomation from "./UserKYCInfomation";

export enum AccountStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING = "pending",
    BANNED = "banned",
}
export interface IUser {
    _id: string;
    email: string;
    password: string;
    otp: string;
    password_reset_token: string;
    password_reset_expires_at: Date;
    verified_at: Date;
    email_verification_token: string;
    email_verification_expires_at: Date;
    status: AccountStatus;
}

@Entity("users")
export default class User extends BaseModel {
    @Column({unique: true})
    user_id!: string;

    @Column({ nullable: true })
    first_name?: string;

    @Column({ nullable: true })
    last_name?: string;

    @Column({nullable: true})
    address?: string;

    @Column({ nullable: true })
    phoneNumber?: string;

    @Column({ nullable: true })
    pin?: string;

    @OneToMany(() => UserKYCInfomation, (kyc)=>kyc.user_id)
    kyc?: UserKYCInfomation

}