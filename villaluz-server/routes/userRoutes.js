const express = require('express');
const { getUsers, createUser, updateUser, deleteUser, loginUser } = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/login', loginUser);

router.get('/', requireAuth, requireAdmin, getUsers);
router.post('/', requireAuth, requireAdmin, createUser);
router.put('/:id', requireAuth, requireAdmin, updateUser);
router.delete('/:id', requireAuth, requireAdmin, deleteUser);

module.exports = router;
