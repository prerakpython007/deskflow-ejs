const express = require('express');
const router = express.Router();
const {
  getDepartments,
  showCreateForm,
  createDepartment,
  showEditForm,
  updateDepartment,
  deleteDepartment,
  getDepartment
} = require('../controllers/departmentController');

// Department routes
router.route('/')
  .get(getDepartments)
  .post(createDepartment);

router.get('/create', showCreateForm);
router.get('/:id/edit', showEditForm);
router.get('/:id', getDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

module.exports = router;