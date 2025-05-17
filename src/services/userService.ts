import User from '../models/userModel';
import { hash, compare } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
export const createUser = async (userData: any) => {
    const hashedPassword = await hash(userData.password, 10);
    const newUser = new User({
        id: uuidv4(),
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        firstname: userData.firstname,
        lastname: userData.lastname,
        gender: userData.gender,
        profile_picture: userData.profile_picture,
        profession: userData.profession,
        company: userData.company,
    });
    return await newUser.save();
};
export const getUserById = async (userId: any) => {
    return await User.findByPk(userId);
};

export const updateUser = async (userId: any, updateData: any) => {
    const user = await User.findByPk(userId);
    console.log('User ID In updateUser:', user?.id);

    if (!user) {
        throw new Error('User not found');
    }
    console.log('Update Data:', updateData);

    const [updated] = await User.update(updateData, { where: { id: user.id } });
    if (updated) {
        const updatedUser = await User.findByPk(userId);
        return updatedUser;
    }
    throw new Error('User not updated');
};

export const deleteUser = async (userId: any) => {
    return await User.destroy({ where: { id: userId } });
};

export const authenticateUser = async (email: any, password: any) => {
    const user = await User.findOne({ where: { email } });
    if (user && await compare(password, user.password)) {
        return user;
    }
    throw new Error('Invalid credentials');
};