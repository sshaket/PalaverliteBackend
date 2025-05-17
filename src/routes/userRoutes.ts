import express, { Request, Response } from 'express';
import { createUserProfile, getUserProfile, updateUserProfile, deleteUserProfile, uploadMiddleware } from '../controllers/userController';

const router = express.Router();

// Route to create a new user
router.post('/register', createUserProfile);

// Route to get user profile by ID
router.get('/:id', async (req: Request, res: Response) => {
    await getUserProfile(req, res);
  });
  

// router.put('/:id', async (req: Request, res: Response) => {
// await updateUserProfile(req, res);
// });

router.put('/:id', uploadMiddleware, updateUserProfile);
  
router.delete('/:id', async (req: Request, res: Response) => {
await deleteUserProfile(req, res);
});
export default router;