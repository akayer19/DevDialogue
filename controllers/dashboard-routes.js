const express = require('express');
const router = express.Router();
const { Post } = require('../models');
const withAuth = require('../utils/auth');

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

module.exports = router;
