const express = require('express');
const router = express.Router();
const { Post, User } = require('../models'); // Import the User model
const withAuth = require('../utils/auth');

// Route to render the dashboard
router.get('/dashboard', withAuth, async (req, res) => {
    console.log("router.get/dashboard Checking if user is already logged in...");
    try {
        console.log("router.get/dashboard User is already logged in, redirecting to dashboard...");
        const userPosts = await Post.findAll({
            where: {
                userId: req.session.userId
            }
        });
        const posts = userPosts.map(post => post.get({ plain: true }));
        console.log("router.get/dashboard Redirected to dashboard");
        // Render the dashboard template with the userLoggedIn variable
        res.render('dashboard', { userLoggedIn: true, posts });
        console.log("router.get/dashboard Rendered dashboard");
    } catch (err) {
        console.error('Error rendering dashboard:', err);
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

router.post('/delete/:postId', withAuth, async (req, res) => {
    const postId = req.params.postId;

    try {
        // Find the post by ID
        const post = await Post.findByPk(postId);

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the logged-in user is the owner of the post
        if (post.userId !== req.session.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Delete the post
        await post.destroy();

        // Redirect back to the dashboard
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});
// Route to render the edit form for a specific post
router.get('/edit/:postId', withAuth, async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (post.userId !== req.session.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        res.render('edit-post', { post });
    } catch (error) {
        console.error('Error rendering edit form:', error);
        res.status(500).render('error', { message: 'Failed to render edit form' });
    }
});

// Route to handle the submission of the edit form
router.post('/edit/:postId', withAuth, async (req, res) => {
    const postId = req.params.postId;
    try {
        const { title, content } = req.body;
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (post.userId !== req.session.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        await post.update({ title, content });
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error editing post:', error);
        res.status(500).render('error', { message: 'Failed to edit post' });
    }
});

// Update the dashboard view to include an edit button for each post

module.exports = router;
