const express = require('express');
const router = express.Router();
const { Post, User } = require('../models'); // Import the User model
const withAuth = require('../utils/auth');

// Route to render the dashboard
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const userPosts = await Post.findAll({
            where: {
                userId: req.session.userId
            }
        });
        const posts = userPosts.map(post => post.get({ plain: true }));
        res.render('dashboard', { posts, loggedIn: true });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Route to render the form for creating a new blog post
router.get('/new-post', (req, res) => {
    res.render('new-post');
});

// Route to handle the submission of the new blog post form
router.post('/new-post', async (req, res) => {
    try {
        // Extract title and content from the form body
        const { title, content } = req.body;

        // Create a new blog post in the database
        const newPost = await Post.create({
            title,
            content,
            // Set userId based on the currently logged-in user
            userId: req.session.userId // Assuming userId is stored in the session upon login
        });

        // Redirect the user back to the dashboard after creating the post
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error creating new blog post:', error);
        // Handle errors appropriately, e.g., render an error page
        res.status(500).render('error', { message: 'Failed to create new blog post' });
    }
});

module.exports = router;
