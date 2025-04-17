import { Column, Entity } from "typeorm";
import { BaseModel } from "./base";

@Entity({ name: "virtual_accounts" })
export default class Wallet extends BaseModel {
    @Column()
    user_id!: string;

    @Column()
    account_name!: string;

    @Column()
    account_number!: string;
}