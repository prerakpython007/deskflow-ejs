const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const methodOverride = require('method-override');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '../frontend/public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Import routes
const departmentRoutes = require('./routes/departmentRoutes');

// Use routes
app.use('/departments', departmentRoutes);
app.use('/api/departments', departmentRoutes);

// Home route
app.get('/', (req, res) => {
  res.redirect('/departments');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});