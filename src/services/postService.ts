import { createPool, RowDataPacket } from 'mysql2/promise';
import { Post } from '../models/postModel';

const pool = createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'echomatelite',
    port: Number(process.env.DB_PORT) || 3307,
});

export const createPost = async (userId: number, content: string, photo: string | null, video: string | null) => {
    const [result] = await pool.query('INSERT INTO posts (user_id, content, photo, video) VALUES (?, ?, ?, ?)', [userId, content, photo, video]);
    return (result as any).insertId;
};

export const getPosts = async () => {
    const [rows] = await pool.query(`
        SELECT 
            posts.id, 
            posts.content, 
            posts.created_at AS createdAt, 
            posts.photo, 
            posts.video, 
            users.username AS user, 
            users.profile_picture AS profilePicture 
        FROM posts 
        JOIN users ON posts.user_id = users.id 
        ORDER BY posts.created_at DESC
    `);
    return rows;
};

export const getPostsByUser = async (userId: number) => {
    const [rows] = await pool.query(`
        SELECT 
            posts.id, 
            posts.content, 
            posts.created_at AS createdAt, 
            posts.photo, 
            posts.video, 
            users.username AS user, 
            users.profile_picture AS profilePicture 
        FROM posts 
        JOIN users ON posts.user_id = users.id 
        WHERE posts.user_id = ? 
        ORDER BY posts.created_at DESC
    `, [userId]);
    return rows;
};

export const likePost = async (postId: number, userId: number) => {
    const [rows] = await pool.query('SELECT * FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]) as [any[], any];
    if (rows.length > 0) {
        await pool.query('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
    } else {
        await pool.query('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
    }
};

export const commentOnPost = async (postId: number, userId: number, comment: string) => {
    const [result] = await pool.query(
        'INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())',
        [postId, userId, comment]
    );

    const commentId = (result as any).insertId;

    // Fetch the newly created comment with user details
    const [rows] = await pool.query(
        `SELECT comments.*, users.username, users.profile_picture 
         FROM comments 
         JOIN users ON comments.user_id = users.id 
         WHERE comments.id = ?`,
        [commentId]
    ) as [RowDataPacket[], any];

    return rows[0]; // Return the new comment
};

export const getPostLikes = async (postId: number) => {
    const [rows] = await pool.query('SELECT * FROM likes WHERE post_id = ?', [postId]);
    return rows;
};

export const getPostComments = async (postId: number) => {
    const [rows] = await pool.execute(`
                SELECT comments.*, users.username, users.profile_picture 
                FROM comments 
                JOIN users ON comments.user_id = users.id 
                WHERE comments.post_id = ?`, [postId]);
    return rows;
};

export const updatePost = async (postId: number, content: string) => {
    await pool.query('UPDATE posts SET content = ?, updated_at = NOW() WHERE id = ?', [content, postId]);
};

export const deletePost = async (postId: number) => {
    await pool.query('DELETE FROM posts WHERE id = ?', [postId]);
};