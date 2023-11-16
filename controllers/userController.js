const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const { requestStatus } = require('../constants')

const { SUCCESS } = requestStatus

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    status: SUCCESS,
    results: users.length,
    data: { users },
  })
})

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  res.status(200).json({
    status: SUCCESS,
    data: { user },
  })
})

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  })

  res.status(201).json({
    status: SUCCESS,
    data: { user: newUser },
  })
})

exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, email, role, active } = req.body
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role, active },
    {
      new: true,
      runValidators: true,
    },
  )

  res.status(200).json({
    status: SUCCESS,
    data: { user },
  })
})

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: SUCCESS,
    data: null,
  })
})
