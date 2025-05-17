import { Pool } from 'mysql2/promise';
import { pool } from '../config/dbConfig';

export interface Post {
    id?: number;
    userId: number;
    content: string;
    photo?: string;
    video?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class PostModel {
    private pool: Pool;

    constructor() {
        this.pool = pool;
    }

    async createPost(post: Post): Promise<Post> {
        const [result] = await this.pool.execute('INSERT INTO posts (user_id, content, photo, video, created_at) VALUES (?, ?, ?, ?, NOW())', [post.userId, post.content, post.photo, post.video]);
        return { id: (result as any).insertId, ...post, createdAt: new Date() };
    }

    async getPosts(): Promise<Post[]> {
        const [rows] = await this.pool.execute(`
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
        return rows as Post[];
    }

    async likePost(postId: number, userId: number): Promise<void> {
        await this.pool.execute('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
    }

    async commentOnPost(postId: number, userId: number, content: string): Promise<void> {
        await this.pool.execute('INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())', [postId, userId, content]);
    }
}