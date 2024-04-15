const express = require('express');
const router = express.Router();

// Define routes
router.get('/', (req, res) => {
  res.send('Home Page');
});

// more routes can be added here

module.exports = router;  // Make sure this is at the end of the file
