// comment-routes.js

const express = require('express');
const router = express.Router();
const { Comment } = require('../models');

// Route to handle comment submission
router.post('/', async (req, res) => {
    try {
        const { content, postId } = req.body;
        const userId = req.session.userId; // Assuming you're using sessions for authentication

        // Create the comment and associate it with the post and user
        const comment = await Comment.create({ content, postId, userId });
        
        res.status(201).json(comment); // Return the created comment
    } catch (err) {
        console.error('Error creating comment:', err);
        res.status(500).json({ error: 'Failed to create comment' });
    }
});

module.exports = router;
