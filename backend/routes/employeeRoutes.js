const express = require('express');
const router = express.Router();
const {
  getEmployees,
  showCreateForm,
  createEmployee,
  showEditForm,
  updateEmployee,
  deleteEmployee,
  getEmployee
} = require('../controllers/employeeController');

router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.get('/create', showCreateForm);
router.get('/:id/edit', showEditForm);
router.get('/:id', getEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;