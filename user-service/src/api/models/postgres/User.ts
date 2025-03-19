import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import StateLGA from "./StateLGA";


@Entity({ name: "users" })
export default class User {
    @Column()
    @PrimaryGeneratedColumn("uuid")
        id?: string;

    @Column()
    @Index({ unique: true })
        email!: string;

    @Column()
        password!: string;

    @Column({ nullable: true })
    // @Index()
        firstName!: string;

    @Column({ nullable: true })
    // @Index()
        lastName!: string;

    @Column({nullable: true})
        address!: string;

    @Column({ nullable: true })
        phoneNumber!: string;

    @Column({ type: "integer", nullable: true })
        stateLgaId!: number;

    @Column({ nullable: true })
        profilePicture?: string;

    @Column({ type: "integer", default: 1 })
    @Index()
        tier?: number;

    @Column({ nullable: true })
        pin?: string;

    @Column({ nullable: true })
    otp?: string;

    @Column({ nullable: true, unique: true })
    password_reset_token?: string;

    @Column({ nullable: true })
    token_expires_at?: Date;

    @Column({ default: false })
    @Index()
        isValidated?: boolean;

    @Column({ default: false })
    @Index()
        isActive?: boolean;

    @Column({ default: false })
    @Index()
        isEnabled?: boolean;

    @Column({ default: false })
    @Index()
        isDeleted?: boolean;

    @CreateDateColumn()
    @Index()
        createdAt?: string;

    @UpdateDateColumn()
    @Index()
        lastUpdatedAt?: Date;

    @Column({nullable:true})
    deletedAt?: Date;

    // ======== JOINS =========

    @ManyToOne(() => StateLGA, (stateLga) => stateLga.id)
        stateLga?: StateLGA;
}