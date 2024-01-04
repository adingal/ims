const express = require('express')
const {
  getAllLoadBoards,
  createLoadBoard,
  getLoadBoard,
  updateLoadBoard,
  deleteLoadBoard,
} = require('../controllers/loadBoardController')

const { protect, restrictTo } = require('../controllers/authController')

const router = express.Router()

router
  .route('/')
  .get(getAllLoadBoards)
  .post(protect, restrictTo('admin'), createLoadBoard)

router
  .route('/:id')
  .get(getLoadBoard)
  .patch(protect, restrictTo('admin'), updateLoadBoard)
  .delete(protect, restrictTo('admin'), deleteLoadBoard)

module.exports = router
