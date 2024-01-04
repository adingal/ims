const LoadBoard = require('../models/loadBoardModel')
const catchAsync = require('../utils/catchAsync')
const { requestStatus } = require('../constants')

const { SUCCESS } = requestStatus

exports.getAllLoadBoards = catchAsync(async (req, res, next) => {
  const loadBoards = await LoadBoard.find()

  res.status(200).json({
    status: SUCCESS,
    results: loadBoards.length,
    data: { loadBoards },
  })
})

exports.createLoadBoard = catchAsync(async (req, res, next) => {
  const { serialNo, type } = req.body
  const newLoadBoard = await LoadBoard.create({
    serialNo,
    type,
    addedBy: req.user._id,
  })

  res.status(201).json({
    status: SUCCESS,
    data: { loadBoard: newLoadBoard },
  })
})

exports.getLoadBoard = catchAsync(async (req, res, next) => {
  const loadBoard = await LoadBoard.findById(req.params.id)

  res.status(200).json({
    status: SUCCESS,
    data: { loadBoard },
  })
})

exports.updateLoadBoard = catchAsync(async (req, res, next) => {
  const { location, active, status } = req.body

  const updatedLoadBoard = await LoadBoard.findByIdAndUpdate(
    req.params.id,
    {
      location,
      active,
      status,
    },
    { new: true, runValidators: true },
  )

  res.status(201).json({
    status: SUCCESS,
    data: { loadBoard: updatedLoadBoard },
  })
})

exports.deleteLoadBoard = catchAsync(async (req, res, next) => {
  await LoadBoard.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: SUCCESS,
    data: null,
  })
})
