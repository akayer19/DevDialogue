// home-routes.js

const express = require('express');
const router = express.Router();
const { User, Post } = require('../models');

router.get('/', async (req, res) => {
    try {
        const fullPosts = await Post.findAll({
            include: User,
            order: [['createdAt', 'DESC']]
        });
        const posts = fullPosts.map(post => post.get({ plain: true }));

        console.log('Posts:', posts); // Log the fetched posts
        res.render('home', { posts });
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).render('error', { message: 'Failed to fetch posts' });
    }
});

module.exports = router;