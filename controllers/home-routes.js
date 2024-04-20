// home-routes.js

const express = require('express');
const router = express.Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    console.log("router.get/home-routes Checking if user is already logged in...");
    try {
        const fullPosts = await Post.findAll({
            include: [
                { model: User },
                { model: Comment, include: [User] } // Include comments and associated users
            ],
            order: [['createdAt', 'DESC']]
        });
        console.log("router.get/home-routes User is already logged in, redirecting to dashboard...");
        const posts = fullPosts.map(post => post.get({ plain: true })); 
        console.log("router.get/home-routes Redirected to dashboard");

        // Log the fetched posts to console
        console.log('Posts:', posts);

        // Additional console log to check user's session and login status
        console.log('home-routes.js router.get Session ID:', req.sessionID);
        console.log('home-routes.js router.get User ID:', req.session.userId);
        console.log('home-routes.js router.get User Logged In:', req.session.userId != null);

        // Render the 'home' view with posts and login status
        res.render('home', {
            posts: posts,
            userLoggedIn: req.session.userId != null  
        });
        console.log("router.get/home-routes Rendered dashboard");
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).render('error', { message: 'Failed to fetch posts' });
    }
});



// Route to handle posting a comment to a specific post
router.post('/post/:postId/comment', withAuth, async (req, res) => {
    console.log(req.params.postId, req.body); // Log the postId and body for debugging

    // Ensure the comment is not empty
    if (!req.body.comment || !req.body.comment.trim()) {
        console.error("Comment field is missing or empty.");
        res.status(400).send("Comment cannot be empty");
        return;
    }

    try {
        // Create a new comment in the database
        const newComment = await Comment.create({
            postId: req.params.postId,
            content: req.body.comment,
            userId: req.session.userId
        });

        console.log('Comment successfully created:', newComment);

        // Redirect or respond according to your application's needs
        res.redirect(`/post/${req.params.postId}`);
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).render('error', { message: 'Failed to post comment' });
    }
});


router.get('/post/:postId', async (req, res) => {
    const postId = req.params.postId;

    try {
        // Fetch the post from the database based on postId
        const post = await Post.findByPk(postId);

        // Check if the post exists
        if (!post) {
            // If the post doesn't exist, render a 404 page or redirect to homepage
            return res.status(404).render('404', { message: 'Post not found' });
        }

        // If the post exists, render the post page with the post data
        res.render('post', { post });
    } catch (error) {
        // If an error occurs while fetching the post, render an error page
        console.error('Error fetching post:', error);
        res.status(500).render('error', { message: 'Failed to fetch post' });
    }
});


module.exports = router;
