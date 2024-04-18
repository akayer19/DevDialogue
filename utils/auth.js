// utils/auth.js

const withAuth = (req, res, next) => {
    console.log("Checking if user is logged in...");
    // Check if the user is not logged in
    if (!req.session.loggedIn) {
        console.log("User is not logged in. Redirecting to login page...");
        // Redirect them to the login page
        res.redirect('/login');
    } else {
        console.log("User is logged in. Proceeding to next middleware function...");
        // If they are logged in, proceed to the next middleware function
        next();
    }
};

module.exports = withAuth;
