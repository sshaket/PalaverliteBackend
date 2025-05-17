import { Request, Response, RequestHandler } from 'express';
import { io } from '../socketServer'; // Import the io instance
import { createPost, getPosts, getPostsByUser, likePost, commentOnPost, getPostLikes, getPostComments, updatePost, deletePost } from '../services/postService';
import multer from 'multer';
import path from 'path';

// Configure multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Create a new post
export const createPostController: RequestHandler[] = [
    upload.single('photo'), // Add this middleware to handle file upload
    async (req: Request, res: Response) => {
        try {
            const { userId, content } = req.body;
            const photo = req.file ? req.file.filename : null;

            const postId = await createPost(userId, content, photo, null);
            res.status(201).json({ message: 'Post created successfully', postId });
        } catch (error) {
            res.status(500).json({ message: 'Error creating post', error });
        }
    }
];

// Get all posts
export const getPostsController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const posts = await getPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};

// Get posts by user
export const getPostsByUserController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params.userId, 10); // Convert userId to a number
        if (isNaN(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }
        const posts = await getPostsByUser(userId);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};

// Like a post
export const likePostController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId, userId } = req.body;
        await likePost(postId, userId);
        res.status(200).json({ message: 'Post like status updates successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating post like status', error });
    }
};

// Comment on a post
export const commentOnPostController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId, userId, comment } = req.body;
        const newComment = await commentOnPost(postId, userId, comment);

        // Emit the new comment event
        io.emit('newComment', { postId, comment: newComment });
        res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error commenting on post', error });
    }
};

// Get likes for a post
export const getPostLikesController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.postId, 10); // Convert postId to a number
        if (isNaN(postId)) {
            res.status(400).json({ message: 'Invalid post ID' });
            return;
        }
        const likes = await getPostLikes(postId);
        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching likes', error });
    }
};

// Get comments for a post
export const getPostCommentsController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.postId, 10); // Convert postId to a number
        if (isNaN(postId)) {
            res.status(400).json({ message: 'Invalid post ID' });
            return;
        }
        const comments = await getPostComments(postId);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
};

// Update a post
export const updatePostController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.postId, 10);
        const { content } = req.body;
        await updatePost(postId, content);
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
};

// Delete a post
export const deletePostController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.postId, 10);
        await deletePost(postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
};