import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { DocumentType } from "../../enums/DocumentType";


@Entity({ name: "users_kyc_information" })
export default class UserKYCInfomation {
    @Column()
    @PrimaryGeneratedColumn()
        id?: number;

    @Column()
    @Index({ unique: true })
        userId: string;

    @Column()
        bvn?: string;

    @Column({
        type: "enum",
        enum: DocumentType
    })
        documentType?: DocumentType;

    @Column()
        documentId?: string;

    @Column({ default: false })
    @Index()
        isBvnVerified?: boolean;

    @Column({ default: false })
    @Index()
        isDocumentVerified?: boolean;
    
    @CreateDateColumn()
    @Index()
        createdAt?: string;

    @UpdateDateColumn()
    @Index()
        lastUpdatedAt?: Date;
}