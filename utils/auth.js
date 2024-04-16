// utils/auth.js

const withAuth = (req, res, next) => {
    // Check if the user is not logged in
    if (!req.session.loggedIn) {
        // Redirect them to the login page
        res.redirect('/login');
    } else {
        // If they are logged in, proceed to the next middleware function
        next();
    }
};

module.exports = withAuth;
