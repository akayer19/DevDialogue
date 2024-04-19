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
        console.log("router.post/login auth-routes Received login request with username:", req.body.username);

        const userData = await User.findOne({ where: { username: req.body.username } });
        
        if (!userData) {
            console.log("router.post/login auth-routes User not found with username:", req.body.username);
            req.flash('error', 'Incorrect username or password, please try again');
            return res.redirect('/login');
        }

        console.log("router.post/login auth-routes User found with username:", req.body.username);

        const validPassword = await bcrypt.compare(req.body.password, userData.password);
        
        if (!validPassword) {
            console.log("router.post/login auth-routes Invalid password for user:", req.body.username);
            req.flash('error', 'Incorrect username or password, please try again');
            return res.redirect('/login');
        }

        console.log("router.post/login auth-routes User logged in successfully:", req.body.username);

        // Set userId and loggedIn in the session
        req.session.save(() => {
            console.log("router.post/login auth-routes Session userId:", req.session.userId); // Log userId
            console.log("router.post/login auth-routes Session loggedIn:", req.session.loggedIn); // Log loggedIn flag

            // Send a response with a script to set userLoggedIn in localStorage
            console.log("router.post/login auth-routes Redirecting to dashboard...");
            req.session.userId = userData.id;
            req.session.loggedIn = true;
            res.redirect('/dashboard');
        });
        res.send(`
            <script>
                localStorage.setItem('userLoggedIn', 'true');
                window.location.href = '/dashboard'; // Redirect to dashboard or home page
            </script>
        `);
    } catch (err) {
        console.error('router.post/login auth-routes Error during login:', err);
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
