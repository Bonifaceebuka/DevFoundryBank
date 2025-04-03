import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
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
    },
    { timestamps: true }
);

export const UserModel = model<IUser>("users", UserSchema);
