import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { NextOfKinRelationship } from "../../enums/NextOfKinRelationship";


@Entity({ name: "users_next_of_kin" })
export default class UserNextOfKin {
    @Column()
    @PrimaryGeneratedColumn()
        id?: number;

    @Column()
    @Index({ unique: true })
        userId: string;

    @Column()
        firstName?: string;

    @Column()
        lastName?: string;

    @Column()
        address?: string;

    @Column()
        phoneNumber?: string;

    @Column({ nullable: true })
        email?: string;

    @Column({
        type: "enum",
        enum: NextOfKinRelationship
    })
        relationship?: NextOfKinRelationship;

    @CreateDateColumn()
    @Index()
        createdAt?: string;

    @UpdateDateColumn()
    @Index()
        lastUpdatedAt?: Date;
}