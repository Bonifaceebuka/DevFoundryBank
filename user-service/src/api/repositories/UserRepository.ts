import { dataSource } from "../../config/postgres";
import User from "../models/postgres/User";
import {IsNull, Not} from 'typeorm'

export const UserRepository = dataSource.getRepository(User).extend({
    async add(user: Partial<User>): Promise<User> {
        return this.save(user);
    },

    async findById(id: string): Promise<User|null> {
        if (!id) return null;
        return this.findOne({ where: { id } });
    },

    async findByEmail(email: string): Promise<User|null> {
        return this.findOne({ where: { email, deletedAt: IsNull() } });
    },

    async findByPasswordResetToken(password_reset_token: string): Promise<User | null> {
        return this.findOne({ where: { password_reset_token } });
    },
    async findByOtp(otp: string, email: string): Promise<User|null> {
        return this.findOne({ where: { email, otp } });
    },

    async list(filter: any = {}): Promise<User[]> {
        return this.find({ ...filter });
    },

    async updateByUser(user: User, updates?: Partial<User>): Promise<User|null> {
        if (!updates) return null;
        await this.update({ id: user.id }, updates);
        return { ...user, ...updates } as User;
    },

    async updateUserPin(user: User, pin?: Partial<User>): Promise<User|null> {
        if (!pin) return null;
        await this.update({ id: user.id }, pin);
        return { ...user } as User;
    },

    async updateById(id: string, updates?: Partial<User>): Promise<User|null> {
        if (!updates) return null;
        const user = await this.findById(id);

        if (!user) return null;
        await this.update({ id }, updates);

        return { ...user, ...updates };
    },

    async findUserByPin(user_id: string, pin?: string): Promise<User|null> {
        if (pin){
            return this.findOne({ where: { id: user_id, pin } });
        }

        return this.findOne({ where: { id: user_id, pin: Not(IsNull()) } });
    },
});