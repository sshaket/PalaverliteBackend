import { Request, Response, RequestHandler } from 'express';
import { createUser, getUserById, updateUser, deleteUser } from '../services/userService';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import fs from 'fs';
import { s3 } from '../config/dbConfig';
import { io } from '../socketServer'; // Import the io instance


interface MulterFile extends Express.Multer.File {
    location?: string;
    key?: string;      // File name in S3
    
}

// Configure multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Configure multer for S3 storage
const s3Storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME || 'your-bucket-name',
    // acl: 'public-read',
    key: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage: process.env.USE_S3 === 'true' ? s3Storage : storage,
});

// Create a new user profile
export const createUserProfile = async (req: Request, res: Response) => {
    try {
        const userProfile = await createUser(req.body);
        res.status(201).json(userProfile);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get user profile by ID
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userProfile = await getUserById(req.params.id);
        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(userProfile);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Update user profile
export const updateUserProfile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        console.log('User ID:', userId);
        console.log('Update Data in controller:', updateData);
        const { username, firstname, lastname, gender, bio, hobbies, profession, company } = req.body;
        // Handle file upload
        let profilePicture = null;
        if (req.file) {
            if (process.env.USE_S3 === 'true') {
                // Extract only the file name from the S3 URL
                profilePicture = (req.file as MulterFile)?.key || null;
            } else {
                // Use the local file name
                profilePicture = req.file.filename;
            }
        }
        // const profilePic = (req.file as MulterFile)?.location|| req.file?.filename || null;
        // const profilePic = req.file ? req.file.filename : null;
        // const photo = req.file ? req.file.filename :
        if(profilePicture){
            updateData.profile_picture = profilePicture;
        }
        
        console.log('Updated Profile Picture:', updateData.profile_picture);
        console.log('Username in controller:', username);
        // const updatedProfile = await updateUser(req.params.id, req.body);

        const updatedProfile = await updateUser(userId, updateData);
        if (!updatedProfile) {
            res.status(404).json({ message: 'User not found' });
        }
        else {
            if (profilePicture) {
                io.emit('profilePictureUpdated', { userId, profilePicture: profilePicture });
            }
            res.status(200).json(updatedProfile);
        }
        
    } catch (error) {
        const err = error as { name: string; message: string };
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 'Username should be unique' });
        } else {
            res.status(500).json({ message: (error as Error).message });
        }    }
};

// Delete user profile
export const deleteUserProfile = async (req: Request, res: Response) => {
    try {
        const deletedProfile = await deleteUser(req.params.id);
        if (!deletedProfile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Middleware to handle file uploads
export const uploadMiddleware = upload.single('profile_picture');