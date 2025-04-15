import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

import StateLGA from "./StateLGA";

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

@Entity({ name: "users" })
export default class User {
    @Column({ unique: true })
    @PrimaryColumn()
    id!: string;

    @Column({ nullable: true })
    firstName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column({nullable: true})
    address?: string;

    @Column({ nullable: true })
    phoneNumber?: string;

    // @Column({ type: "integer", nullable: true })
    //     stateLgaId!: number;

    // @Column({ nullable: true })
    //     profilePicture?: string;

    // @Column({ type: "integer", default: 1 })
    // @Index()
    //     tier?: number;

    @Column({ nullable: true })
    pin?: string;

    // @CreateDateColumn()
    // @Index()
    //     createdAt?: string;

    // @Column({nullable:true})
    // deletedAt?: Date;

    // // ======== JOINS =========

    // @ManyToOne(() => StateLGA, (stateLga) => stateLga.id)
    //     stateLga?: StateLGA;
}