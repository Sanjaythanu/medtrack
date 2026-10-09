const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { createUserValidation, updateUserValidation } = require('../validators/userValidator');

router.use(protect);

router
  .route('/')
  .get(authorize('Admin'), getUsers)
  .post(authorize('Admin'), createUserValidation, createUser);

router
  .route('/:id')
  .get(getUserById)
  .put(updateUserValidation, updateUser)
  .delete(authorize('Admin'), deleteUser);

module.exports = router;
