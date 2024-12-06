import mongoose, { Document, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
dotenv.config();
const jwtsecret =process.env.JWT_SECRET;
if (!jwtsecret) {
    throw new Error('Kindly check environment variables, JWT_SECRET is not defined');
}
export interface UserInterface extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    getJWT(): string; 
    validatePassword(passwordInputByUser: string): Promise<boolean>;
}


const userSchema: Schema<UserInterface> = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true, 
            lowercase: true,
            trim: true,
            validate: {
                validator: (value: string) => {
                    
                    const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
                    return regex.test(value);
                },
                message: 'Invalid email',
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 8, 
        },
    },
    {
        timestamps: true, 
    }
);
userSchema.methods.getJWT = function (): string {
    const user = this as UserInterface; 
    const token = jwt.sign({ _id: user._id },jwtsecret as string , { expiresIn: '7d' });
    return token;
}


userSchema.methods.validatePassword = async function (passwordInputByUser: string): Promise<boolean> {
    const user = this as UserInterface; 
    const passwordHash = user.password;
    const isValidPassword = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isValidPassword;
}


const User = mongoose.model<UserInterface>('User', userSchema);


export default User;