-- SQL Operations for EchoMateLite Backend

-- User Operations
-- Create a new user
INSERT INTO users (username, password, email, firstname, lastname, profile_picture) VALUES ('exampleUser', 'hashedPassword', 'user@example.com', 'FirstName', 'LastName', 'profilePic.jpg');
-- Retrieve a user by ID
SELECT * FROM users WHERE id = 1;

-- Update user profile
UPDATE users SET username = 'newUsername', email = 'newEmail@example.com', firstname = 'NewFirstName', lastname = 'NewLastName', profile_picture = 'newProfilePic.jpg' WHERE id = 1;
-- Delete a user
DELETE FROM users WHERE id = 1;

-- Post Operations
-- Create a new post
INSERT INTO posts (user_id, content, photo, video, created_at) VALUES (1, 'This is a post content.', 'post1.jpg', 'video1.m4v', NOW());

-- Retrieve all posts
SELECT * FROM posts ORDER BY created_at DESC;

-- Retrieve a post by ID
SELECT * FROM posts WHERE id = 1;

-- Update a post
UPDATE posts SET content = 'Updated post content', photo = 'updatedPhoto.jpg', video = 'updatedVideo.m4v' WHERE id = 1;

-- Delete a post
DELETE FROM posts WHERE id = 1;

-- Like a post
INSERT INTO likes (user_id, post_id) VALUES (1, 1);

-- Unlike a post
DELETE FROM likes WHERE user_id = 1 AND post_id = 1;

-- Comment Operations
-- Add a comment to a post
INSERT INTO comments (post_id, user_id, content, created_at) VALUES (1, 1, 'This is a comment', NOW());

-- Retrieve comments for a post
SELECT * FROM comments WHERE post_id = 1 ORDER BY created_at ASC;

-- Delete a comment
DELETE FROM comments WHERE id = 1;