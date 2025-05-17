import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

export const registerUser = async (username: string, password: string, email: string, firstname: string, lastname: string) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, password: hashedPassword, email, firstname, lastname });
    return await newUser.save();
};

export const loginUser = async (username: string, password: string) => {
    const user = await User.findOne({ where: { username } });
    if (!user) {
        throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
    return { token, user };
};

export const getUserById = async (id: string) => {
    return await User.findByPk(id);
};