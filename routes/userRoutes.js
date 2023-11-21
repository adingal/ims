const express = require('express')
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController')

const { login, protect, restrictTo } = require('../controllers/authController')

const router = express.Router()

router.post('/login', login)

router
  .route('/')
  .get(getAllUsers)
  .post(protect, restrictTo('admin'), createUser)

router
  .route('/:id')
  .get(getUser)
  .patch(protect, restrictTo('admin'), updateUser)
  .delete(protect, restrictTo('admin'), deleteUser)

module.exports = router
