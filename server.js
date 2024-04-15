require('dotenv').config();
const express = require('express');
const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars');

// Import your configuration
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.js')[env];

// Create a Sequelize instance
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Handlebars.js engine
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Session setup with Sequelize store
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new SequelizeStore({
    db: sequelize
  }),
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: env === 'production' // Ensures cookies are secure in production
  }
}));

// Middleware to parse JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Import routes
const routes = require('./controllers/home-routes');
app.use(routes);

// Database and server initialization
sequelize.sync({ force: false }) // Avoid using 'force: true' in production as it will drop all tables
  .then(() => {
    console.log('Database synced!');
    // Start the server
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
