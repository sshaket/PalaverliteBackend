CREATE FUNCTION getUserPosts(userId INT)
RETURNS JSON
BEGIN
    DECLARE result JSON;
    SET result = (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'postId', id,
                'content', content,
                'photo', photo,
                'video', video,
                'createdAt', created_at
            )
        )
        FROM posts
        WHERE user_id = userId
        ORDER BY created_at DESC
    );
    RETURN result;
END;

CREATE FUNCTION likePost(postId INT, userId INT)
RETURNS BOOLEAN
BEGIN
    DECLARE postExists INT;
    DECLARE likeExists INT;

    SELECT COUNT(*) INTO postExists FROM posts WHERE id = postId;
    SELECT COUNT(*) INTO likeExists FROM likes WHERE post_id = postId AND user_id = userId;

    IF postExists = 0 THEN
        RETURN FALSE;
    END IF;

    IF likeExists = 0 THEN
        INSERT INTO likes (post_id, user_id) VALUES (postId, userId);
    END IF;

    RETURN TRUE;
END;

CREATE FUNCTION commentOnPost(postId INT, userId INT, comment TEXT)
RETURNS BOOLEAN
BEGIN
    DECLARE postExists INT;

    SELECT COUNT(*) INTO postExists FROM posts WHERE id = postId;

    IF postExists = 0 THEN
        RETURN FALSE;
    END IF;

    INSERT INTO comments (post_id, user_id, content) VALUES (postId, userId, comment);
    RETURN TRUE;
END;