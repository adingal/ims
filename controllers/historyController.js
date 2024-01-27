const LoadBoard = require('../models/loadBoardModel')
const History = require('../models/historyModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const { requestStatus } = require('../constants')

const { SUCCESS } = requestStatus

exports.getAllHistory = catchAsync(async (req, res, next) => {
  const histories = await History.find()

  res.status(200).json({
    status: SUCCESS,
    results: histories.length,
    data: { histories },
  })
})

exports.getLoadBoardHistory = catchAsync(async (req, res, next) => {
  const loadBoardHistory = await History.find({
    loadBoard: req.params.serialNo.toUpperCase(),
  })

  res.status(201).json({
    status: SUCCESS,
    results: loadBoardHistory.length,
    data: { history: loadBoardHistory },
  })
})

exports.createHistory = catchAsync(async (req, res, next) => {
  const { loadBoard, status, location } = req.body
  const getLoadBoard = await LoadBoard.findOne({ serialNo: loadBoard })

  if (!getLoadBoard) {
    return next(new AppError(`Please provide a valid loadboard ID.`, 422))
  }

  if (getLoadBoard.status === status) {
    return next(new AppError(`This loadboard is already ${status}.`, 422))
  }

  const newHistory = await History.create({
    loadBoard,
    status,
    location,
    transactedBy: req.user._id,
  })

  res.status(201).json({
    status: SUCCESS,
    data: { history: newHistory },
  })
})

exports.deleteHistory = catchAsync(async (req, res, next) => {
  await History.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: SUCCESS,
    data: null,
  })
})
