import { dataSource } from "../../config/postgres";
import User from "../models/postgres/User";
import {IsNull, Not} from 'typeorm'
import UserKYCInfomation, { KYCTiers } from "../models/postgres/UserKYCInfomation";

export const UserKycRepository = dataSource.getRepository(UserKYCInfomation).extend({
    async create(userkycUserKYCInfomation: Partial<UserKYCInfomation>)
    : Promise<UserKYCInfomation> 
    {
        return await this.save(userkycUserKYCInfomation);
    },

    async findByIdAndTier(user_id: string, tier: KYCTiers)
    : Promise<UserKYCInfomation|null> 
    {
        return await this.findOne({where: {user_id, tier}});
    },

    async findByIdUserId(user_id: string){
        return await this.findOne({where: {user_id}});
    }
});