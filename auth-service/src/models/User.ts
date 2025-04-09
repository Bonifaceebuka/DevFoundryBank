import { Schema, model, Document } from "mongoose";

export enum AccountStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING = "pending",
    BANNED = "banned",
}
export interface IUser extends Document {
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


const UserSchema = new Schema<IUser>(
    {
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        otp: {
            type: String,
            required: false,
            unique: true
        },
        password_reset_token: {
            type: String,
            default: null,
            required: false
        },
        email_verification_token: {
            type: String,
            required: false,
        },
        verified_at: {
            type: Date,
            required: false,
        },
        status: {
            type: String,
            enum: Object.values(AccountStatus),
            default: AccountStatus.PENDING,
        },
    },
    { timestamps: true }
);

export const UserModel = model<IUser>("users", UserSchema);
