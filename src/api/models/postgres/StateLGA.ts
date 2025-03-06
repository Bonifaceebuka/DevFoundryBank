import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: "state_lgas" })
export default class StateLGA {
    @Column()
    @PrimaryGeneratedColumn()
        id?: number;

    @Column()
    @Index()
        state: string;

    @Column()
        lga: string;

    @CreateDateColumn()
        createdAt?: string;
}