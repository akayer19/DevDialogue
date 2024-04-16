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
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Setup session with Sequelize store
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new SequelizeStore({ db: sequelize }),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: env === 'production' } // Ensure secure cookies in production
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

// Use routes
app.use(homeRoutes);
app.use(authRoutes);
app.use(dashboardRoutes);

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
