const express = require('express')
const {
  getAllHistory,
  getLoadBoardHistory,
  createHistory,
  deleteHistory,
} = require('../controllers/historyController')

const { protect, restrictTo } = require('../controllers/authController')

const router = express.Router()

router.use(protect)

router
  .route('/')
  .get(getAllHistory)
  .post(restrictTo('admin', 'user'), createHistory)

router
  .route('/:id')
  .get(getLoadBoardHistory)
  .delete(restrictTo('admin'), deleteHistory)

module.exports = router
