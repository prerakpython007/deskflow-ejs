const Employee = require('../models/Employee');
const Department = require('../models/Department');

const getEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    if (req.query.department && req.query.department !== 'all') {
      query.department = req.query.department;
    }
    
    if (req.query.jobTitle && req.query.jobTitle !== 'all') {
      query.jobTitle = req.query.jobTitle;
    }
    
    const employees = await Employee.find(query)
      .populate('department')
      .populate('supervisor')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');
    
    const total = await Employee.countDocuments(query);
    const departments = await Department.find().sort('name');
    const jobTitles = await Employee.distinct('jobTitle');
    
    if (req.path.startsWith('/api/') || req.xhr) {
      return res.json({
        success: true,
        data: employees,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }
    
    res.render('employees/index', {
      title: 'Employees',
      employees,
      departments,
      jobTitles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        search: req.query.search || '',
        department: req.query.department || 'all',
        jobTitle: req.query.jobTitle || 'all'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Server Error' });
  }
};

const showCreateForm = async (req, res) => {
  try {
    const departments = await Department.find().sort('name');
    const employees = await Employee.find().sort('firstName');
    
    res.render('employees/create', {
      title: 'Create Employee',
      departments,
      employees,
      employee: null
    });
  } catch (error) {
    res.status(500).render('error', { message: 'Server Error' });
  }
};

const createEmployee = async (req, res) => {
  try {
    const employeeData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      jobTitle: req.body.jobTitle,
      department: req.body.department,
      supervisor: req.body.supervisor || null,
      salary: req.body.salary,
      dateOfBirth: req.body.dateOfBirth,
      address: req.body.address,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      joinDate: req.body.joinDate || Date.now()
    };
    
    const employee = await Employee.create(employeeData);
    
    if (req.path.startsWith('/api/')) {
      return res.status(201).json({ success: true, data: employee });
    }
    
    res.redirect('/employees');
  } catch (error) {
    if (error.code === 11000) {
      const departments = await Department.find().sort('name');
      const employees = await Employee.find().sort('firstName');
      return res.render('employees/create', {
        title: 'Create Employee',
        departments,
        employees,
        employee: req.body,
        error: 'Email already exists'
      });
    }
    
    const departments = await Department.find().sort('name');
    const employees = await Employee.find().sort('firstName');
    res.render('employees/create', {
      title: 'Create Employee',
      departments,
      employees,
      employee: req.body,
      error: error.message
    });
  }
};

const showEditForm = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    const departments = await Department.find().sort('name');
    const employees = await Employee.find({ _id: { $ne: req.params.id } }).sort('firstName');
    
    if (!employee) {
      return res.status(404).render('error', { message: 'Employee not found' });
    }
    
    res.render('employees/edit', {
      title: 'Edit Employee',
      employee,
      departments,
      employees
    });
  } catch (error) {
    res.status(500).render('error', { message: 'Server Error' });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        jobTitle: req.body.jobTitle,
        department: req.body.department,
        supervisor: req.body.supervisor || null,
        salary: req.body.salary,
        dateOfBirth: req.body.dateOfBirth,
        address: req.body.address,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        isActive: req.body.isActive === 'on'
      },
      { new: true, runValidators: true }
    );
    
    res.redirect('/employees');
  } catch (error) {
    const departments = await Department.find().sort('name');
    const employees = await Employee.find({ _id: { $ne: req.params.id } }).sort('firstName');
    res.render('employees/edit', {
      title: 'Edit Employee',
      employee: { _id: req.params.id, ...req.body },
      departments,
      employees,
      error: error.message
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    await Employee.updateMany(
      { supervisor: req.params.id },
      { supervisor: null }
    );
    
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect('/employees');
  } catch (error) {
    console.error(error);
    res.redirect('/employees');
  }
};

const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('department')
      .populate('supervisor');
    
    const subordinates = await Employee.find({ supervisor: req.params.id }).populate('department');
    
    if (!employee) {
      return res.status(404).render('error', { message: 'Employee not found' });
    }
    
    res.render('employees/show', {
      title: employee.fullName,
      employee,
      subordinates
    });
  } catch (error) {
    res.status(500).render('error', { message: 'Server Error' });
  }
};

module.exports = {
  getEmployees,
  showCreateForm,
  createEmployee,
  showEditForm,
  updateEmployee,
  deleteEmployee,
  getEmployee
};