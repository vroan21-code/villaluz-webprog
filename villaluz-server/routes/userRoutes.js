const express = require('express');
const { getUsers, createUser, updateUser, deleteUser, loginUser } = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/login', loginUser);

// Public read (same as typical class demo: /api/users works in the browser)
router.get('/', getUsers);
router.post('/', requireAuth, requireAdmin, createUser);
router.put('/:id', requireAuth, requireAdmin, updateUser);
router.delete('/:id', requireAuth, requireAdmin, deleteUser);

module.exports = router;
