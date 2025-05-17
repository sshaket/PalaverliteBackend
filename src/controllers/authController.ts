import { Request, Response, RequestHandler } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from '../config/dbConfig';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';


interface MulterFile extends Express.Multer.File {
    location?: string;
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

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// User registration
export const registerUser: RequestHandler = async (req: Request, res: Response) => {
    const { username, password, email, firstname, lastname, gender, profilePicture } = req.body;
    const profilePic = (req.file as MulterFile)?.location || req.file?.path || profilePicture || null;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword, email, firstname, lastname, profile_picture: profilePic, gender });

        // Generate email verification token
        const emailToken = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

        // Send verification email
        

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            text: `Please verify your email by clicking the following link: ${process.env.BASE_URL}/api/auth/verify-email?token=${emailToken}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'User registered successfully. Please verify your email.', userId: newUser.id });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// Email verification
export const verifyEmail: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query;

    try {
        const decoded: any = jwt.verify(token as string, process.env.JWT_SECRET || 'secret');
        const user = await User.findByPk(decoded.id);
        if (!user) {
            res.status(404).send('<script>alert("User not found"); window.close();</script>');
            return;
        }

        user.emailVerified = true;
        await user.save();

        // res.status(200).json({ message: 'Email verified successfully' });
        res.status(200).send('<script>alert("Email verified successfully. Please close this window and go to login page."); window.close();</script>');
    } catch (error) {
        const err = error as Error; // Type assertion
        // res.status(500).json({ message: 'Error verifying email', error });
        res.status(500).send(`<script>alert("Error verifying email: ${err.message}"); window.close();</script>`);


    }
};

// User login
export const loginUser: RequestHandler = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (!user.emailVerified) {
            res.status(401).json({ message: 'Email not verified. Please verify your email to log in.' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, userId: user.id }); // Include userId in the response
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Forgot Password
export const forgotPassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpToken = jwt.sign({ id: user.id, otp }, process.env.JWT_SECRET || 'secret', { expiresIn: '10m' });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent to email', otpToken });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error });
    }
};

// Verify OTP and Reset Password
export const verifyOtpAndResetPassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { otpToken, otp, newPassword, confirmPassword } = req.body;

    try {
        const decoded: any = jwt.verify(otpToken, process.env.JWT_SECRET || 'secret');
        if (decoded.otp !== otp) {
            res.status(400).json({ message: 'Invalid OTP' });
            return;
        }

        // Check if OTP is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
            res.status(400).json({ message: 'OTP expired' });
            return;
        }

        if (newPassword !== confirmPassword) {
            res.status(400).json({ message: 'Passwords do not match' });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update({ password: hashedPassword }, { where: { id: decoded.id } });

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error });
    }
};

// Middleware to handle file uploads
export const uploadMiddleware = upload.single('photo');