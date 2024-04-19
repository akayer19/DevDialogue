// auth-routes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const flash = require('connect-flash');
const router = express.Router();

// Add connect-flash middleware
router.use(flash());

router.get('/login', (req, res) => {
    console.log("router.get Checking if user is already logged in...");
    if (req.session.loggedIn) {
        console.log("router.get User is already logged in, redirecting to dashboard...");
        res.redirect('/');
        console.log("router.get Redirected to dashboard");
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

        // Set userId and loggedIn in the session
        req.session.userId = userData.id;
        req.session.loggedIn = true;
        req.session.save(() => {
            res.redirect('/dashboard');
        });
    } catch (err) {
        console.error('Error during login:', err);
        req.flash('error', 'Failed to log in due to server error');
        res.status(500).redirect('/login');
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
    console.log("router.get Attempting to log out...");
    if (req.session.loggedIn) {
        console.log("router.get Session found, destroying...");
        req.session.destroy(err => {
            if (err) {
                console.log("router.get Error destroying session:", err);
                res.status(500).send('Failed to log out');
            } else {
                console.log("router.get Session destroyed, redirecting...");
                res.redirect('/');
            }
        });
    } else {
        console.log("router.get No session found, redirecting...");
        res.redirect('/');
    }
});

module.exports = router;