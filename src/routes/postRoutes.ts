import { Router } from 'express';
import { createPostController, getPostsController, getPostsByUserController, likePostController, commentOnPostController, getPostLikesController, getPostCommentsController, updatePostController, deletePostController } from '../controllers/postController';

const router = Router();

// // Route to create a new post
// router.post('/', createPostController);

// // Route to get all posts
// router.get('/', getPostsController);

// // Route to like a post
// router.post('/:postId/like', likePostController);

// // Route to comment on a post
// router.post('/:postId/comment', commentOnPostController);

// export default router;
// Route to create a new post
router.post('/', createPostController);

// Route to get all posts
router.get('/', getPostsController);

// Route to get posts by user
router.get('/user/:userId', getPostsByUserController);

// Route to like a post
router.post('/:postId/like', likePostController);

// Route to comment on a post
router.post('/:postId/comment', commentOnPostController);

// Route to get likes for a post
router.get('/:postId/likes', getPostLikesController);

// Route to get comments for a post
router.get('/:postId/comments', getPostCommentsController);

// Route to update a post
router.put('/:postId', updatePostController);

// Route to delete a post
router.delete('/:postId', deletePostController);

export default router;