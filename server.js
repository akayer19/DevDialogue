require('dotenv').config();
const express = require('express');
const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const { sequelize, User } = require('./models');

// Import configurations
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.js')[env];

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Handlebars view engine
const hbs = exphbs.create({
  // Set runtime options to allow prototype access
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true
  },
  helpers: {
    formatDate: function (date) {
      // Create a new Date object from the input date
      const newDate = new Date(date);
      // Format the date and time according to the locale
      const formattedDate = newDate.toLocaleDateString("en-US", {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      const formattedTime = newDate.toLocaleTimeString("en-US", {
        hour: '2-digit', minute: '2-digit', hour12: true
      });
      // Combine date and time into one string
      return `${formattedDate} at ${formattedTime}`;
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Setup session with Sequelize store
const sessionSecret = process.env.SESSION_SECRET;
console.log("SESSION_SECRET:", sessionSecret);

app.use(session({
  secret: sessionSecret,
  cookie: { 
    maxAge: 86400,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({ db: sequelize }),
  // cookie: { secure: env === 'production' } // Ensure secure cookies in production
}));

app.use(flash());  // Use flash for storing session messages

// Middleware for parsing application/json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Import routes
const homeRoutes = require('./controllers/home-routes');
const authRoutes = require('./controllers/auth-routes'); // Import authentication routes
const dashboardRoutes = require('./controllers/dashboard-routes'); // Import dashboard routes
const commentRoutes = require('./controllers/comment-routes');

// Use routes
app.use(homeRoutes);
app.use(authRoutes);
app.use(dashboardRoutes);
app.use('/comments', commentRoutes);

// Sync database and start server
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced!');
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Failed to sync database:', err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
