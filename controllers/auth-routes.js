const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const flash = require('connect-flash');
const router = express.Router();

// Add connect-flash middleware
router.use(flash());

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
        return;
    }
    const errors = req.flash('error'); // Get flash messages
    res.render('login', { errors }); // Pass flash messages to the view
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { username: req.body.username } });
        if (!userData) {
            req.flash('error', 'Incorrect username or password, please try again');
            return res.redirect('/login');
        }
        const validPassword = await bcrypt.compare(req.body.password, userData.password);
        if (!validPassword) {
            req.flash('error', 'Incorrect username or password, please try again');
            return res.redirect('/login');
        }
        req.session.save(() => {
            req.session.userId = userData.id;
            req.session.loggedIn = true;
            req.flash('success', 'You are now logged in!');
            res.redirect('/dashboard');
        });
    } catch (err) {
        req.flash('error', 'Failed to log in due to server error');
        res.status(500).redirect('/login');
    } finally {
        req.session.errors = []; // Clear flash messages after they are displayed
    }
});



router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        req.session.save(() => {
            req.session.userId = newUser.id;
            req.session.loggedIn = true;
            res.redirect('/dashboard');
        });
    } catch (err) {
        res.status(500).render('signup', { errors: ['Failed to sign up due to server error'] });
    }
});

router.get('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;
