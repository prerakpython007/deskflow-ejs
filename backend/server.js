const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const methodOverride = require('method-override');
const connectDB = require('./config/database');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const locationRoutes = require('./routes/locationRoutes');

app.use('/departments', departmentRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/employees', employeeRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/locations', locationRoutes);

app.get('/', (req, res) => {
  res.redirect('/employees');
});

app.get('/error', (req, res) => {
  res.render('error', { message: 'An error occurred' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});