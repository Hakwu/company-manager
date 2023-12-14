import { Schema, Document, model } from 'mongoose';

interface UserDocument extends Document {
    email: string;
    password: string;
}

const userSchema = new Schema<UserDocument>({
    email: {
        type: String,
        required: [true, 'Please provide an Email!'],
        unique: true,
    },

    password: {
        type: String,
        required: [true, 'Please provide a password!'],
        unique: false,
    },
});

const User = model<UserDocument>('User', userSchema);
export default User;
