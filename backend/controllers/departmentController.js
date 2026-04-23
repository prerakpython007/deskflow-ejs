const Department = require('../models/Department');
const Employee = require('../models/Employee');


const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort('name');
    
    // Check if it's an API request
    if (req.path.startsWith('/api/') || req.xhr) {
      return res.json({ success: true, data: departments });
    }
    
    // Render HTML view
    res.render('departments/index', {
      title: 'Departments',
      departments,
      path: '/departments'
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Server Error' });
  }
};


const showCreateForm = async (req, res) => {
  res.render('departments/create', { 
    title: 'Create Department',
    department: null
  });
};


const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const department = await Department.create({
      name,
      description
    });
    
    req.flash = req.flash || function() {};
    
    if (req.path.startsWith('/api/')) {
      return res.status(201).json({ success: true, data: department });
    }
    
    res.redirect('/departments');
  } catch (error) {
    if (error.code === 11000) {
      return res.render('departments/create', {
        title: 'Create Department',
        department: req.body,
        error: 'Department name already exists'
      });
    }
    res.render('departments/create', {
      title: 'Create Department', 
      department: req.body,
      error: error.message
    });
  }
};


const showEditForm = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).render('error', { message: 'Department not found' });
    }
    
    res.render('departments/edit', {
      title: 'Edit Department',
      department
    });
  } catch (error) {
    res.status(500).render('error', { message: 'Server Error' });
  }
};

// @desc    Update a department
// @route   PUT /departments/:id
const updateDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    
    if (!department) {
      return res.status(404).render('error', { message: 'Department not found' });
    }
    
    res.redirect('/departments');
  } catch (error) {
    res.render('departments/edit', {
      title: 'Edit Department',
      department: { _id: req.params.id, ...req.body },
      error: error.message
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {

    const employeeCount = await Employee.countDocuments({ department: req.params.id });
    
    if (employeeCount > 0) {
      req.flash = req.flash || function() {};
      return res.redirect('/departments');
    }
    
    await Department.findByIdAndDelete(req.params.id);
    res.redirect('/departments');
  } catch (error) {
    console.error(error);
    res.redirect('/departments');
  }
};


const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    const employees = await Employee.find({ department: req.params.id }).populate('supervisor');
    
    if (!department) {
      return res.status(404).render('error', { message: 'Department not found' });
    }
    
    res.render('departments/show', {
      title: department.name,
      department,
      employees
    });
  } catch (error) {
    res.status(500).render('error', { message: 'Server Error' });
  }
};

module.exports = {
  getDepartments,
  showCreateForm,
  createDepartment,
  showEditForm,
  updateDepartment,
  deleteDepartment,
  getDepartment
};