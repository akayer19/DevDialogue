// home-routes.js

const express = require('express');
const router = express.Router();
const { User, Post } = require('../models');

router.get('/', async (req, res) => {
    try {
        const fullPosts = await Post.findAll({
            include: [User],
            order: [['createdAt', 'DESC']]
        });
        const posts = fullPosts.map(post => post.get({ plain: true }));

        // Log the fetched posts to console
        console.log('Posts:', posts);

        // Additional console log to check user's session and login status
        console.log('home-routes.js router.get Session ID:', req.sessionID);
        console.log('home-routes.js router.get User ID:', req.session.userId);
        console.log('home-routes.js router.get User Logged In:', req.session.userId != null);

        // Render the 'home' view with posts and login status
        res.render('home', { 
            posts: posts,
            userLoggedIn: req.session.userId != null  // Pass this to your template
        });
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).render('error', { message: 'Failed to fetch posts' });
    }
});



module.exports = router;