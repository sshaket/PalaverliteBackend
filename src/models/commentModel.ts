import { Pool } from 'mysql2/promise';
import { pool } from '../config/dbConfig';

export interface Comment {
    id: number;
    postId: number;
    userId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    username: string; // Add this field
    profile_picture: string; // Add this field
}

export class CommentModel {
    private pool: Pool;

    constructor() {
        this.pool = pool;
    }

    async createComment(postId: number, userId: number, content: string): Promise<Comment> {
        const [result] = await this.pool.execute('INSERT INTO comments (post_id, user_id, content, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())', [postId, userId, content]);
        const id = (result as any).insertId;
        return { id, postId, userId, content, createdAt: new Date(), updatedAt: new Date(), username: '', profile_picture: '' };
    }

    async getCommentsByPostId(postId: number): Promise<Comment[]> {
        const [rows] = await this.pool.execute(`
            SELECT comments.*, users.username, users.profile_picture 
            FROM comments 
            JOIN users ON comments.user_id = users.id 
            WHERE comments.post_id = ?`, [postId]);
        return rows as Comment[];
    }

    async updateComment(id: number, content: string): Promise<void> {
        await this.pool.execute('UPDATE comments SET content = ?, updated_at = NOW() WHERE id = ?', [content, id]);
    }

    async deleteComment(id: number): Promise<void> {
        await this.pool.execute('DELETE FROM comments WHERE id = ?', [id]);
    }
}