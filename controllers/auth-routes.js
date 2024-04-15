const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models'); // Adjust path as necessary
const router = express.Router();

router.get('/login', (req, res) => {
    // If the user is already logged in, redirect to the dashboard or home
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
        return;
    }
  
    // Render the login view if the user is not logged in
    res.render('login');
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });
        if (!userData) {
            req.flash('error', 'Incorrect email or password, please try again');
            return res.redirect('/login');
        }
        const validPassword = await bcrypt.compare(req.body.password, userData.password);
        if (!validPassword) {
            req.flash('error', 'Incorrect email or password, please try again');
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
    }
});

module.exports = router;
