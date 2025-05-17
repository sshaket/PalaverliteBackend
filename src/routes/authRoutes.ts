import { Router } from 'express';
import { registerUser, loginUser, verifyEmail, uploadMiddleware, forgotPassword, verifyOtpAndResetPassword } from '../controllers/authController';

const router = Router();

// Route for user registration
router.post('/register', uploadMiddleware, registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for email verification
router.get('/verify-email', verifyEmail);

// Route for forgot password
router.post('/forgot-password', forgotPassword);

// Route for OTP verification and reset password
router.post('/verify-otp-reset-password', verifyOtpAndResetPassword);


export default router;