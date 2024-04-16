// home-routes.js

const express = require('express');
const router = express.Router();
const { Post } = require('../models'); // Assuming a Post model is set up

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll();
        const posts = postData.map(post => post.get({ plain: true }));

        res.render('home', { 
            posts, 
            loggedIn: req.session.loggedIn 
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;