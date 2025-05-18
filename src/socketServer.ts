import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { sequelize } from './config/dbConfig';
import cors from 'cors';
import app from './app';

const PORT = process.env.PORT || 3000;

// Create an HTTP server
const server = http.createServer(app);
// app.use(cors({
//   origin: process.env.ALLOWED_ORIGINS || '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   credentials: true,
//   maxAge: 86400 // 24 hours
// }));

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    },
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle custom events
    socket.on('newPost', (data) => {
        console.log('New post event received:', data);
        io.emit('newPost', data); // Broadcast the new post to all connected clients
    });

    socket.on('deletePost', (postId) => {
        console.log('Delete post event received:', postId);
        io.emit('deletePost', postId); // Broadcast the delete post to all connected clients
    });

    socket.on('likePost', ({ postId, userId }) => {
        console.log('Like post event received:', { postId, userId });
        io.emit('likePost', { postId, userId }); // Broadcast the like post to all connected clients
    });

    socket.on('profilePictureUpdated', ({ userId, profilePicture }) => {
        console.log('Profile picture updated event received:', { userId, profilePicture });
        io.emit('profilePictureUpdated', { userId, profilePicture }); // Broadcast the profile picture update to all connected clients
    });

    socket.on('newComment', ({ postId, comment }) => {
        console.log('New comment event received:', { postId, comment });
        io.emit('newComment', { postId, comment }); // Broadcast the new comment to all connected clients
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Database connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connected');
        return sequelize.sync(); // Synchronize models with the database
    })
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((err: any) => console.error('Database connection failed', err));

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export { io };