const express = require('express');
const router = express.Router();

// Define routes
router.get('/', (req, res) => {
  // Render 'home' template using 'main' layout
  res.render('home', {
    layout: 'main' // This is usually the default and can be omitted if you have set 'main' as the default layout in the exphbs configuration
  });
});

// more routes can be added here

module.exports = router;  // Make sure this is at the end of the file
