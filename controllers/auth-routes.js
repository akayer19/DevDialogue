const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const flash = require('connect-flash');
const router = express.Router();

// Add connect-flash middleware
router.use(flash());

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
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
        console.log("User logged in:", req.session.userId); // Log userId
        console.log("Session logged in:", req.session.loggedIn); // Log loggedIn flag
        // Send a response with a script to set userLoggedIn in localStorage
        console.log("Redirecting to dashboard...");

        res.send(`
            <script>
                localStorage.setItem('userLoggedIn', 'true');
                window.location.href = '/dashboard'; // Redirect to dashboard or home page
            </script>
        `);
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
    console.log("Attempting to log out...");
    if (req.session.loggedIn) {
        console.log("Session found, destroying...");
        req.session.destroy(err => {
            if (err) {
                console.log("Error destroying session:", err);
                res.status(500).send('Failed to log out');
            } else {
                console.log("Session destroyed, redirecting...");
                res.redirect('/');
            }
        });
    } else {
        console.log("No session found, redirecting...");
        res.redirect('/');
    }
});



module.exports = router;
