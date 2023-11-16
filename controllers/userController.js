const User = require('../models/userModel')
const { requestStatus } = require('../constants')

const { SUCCESS, FAILED } = requestStatus

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()

    res.status(200).json({
      status: SUCCESS,
      results: users.length,
      data: { users },
    })
  } catch (err) {
    res.status(404).json({
      status: FAILED,
      message: err,
    })
  }
}

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    res.status(200).json({
      status: SUCCESS,
      data: { user },
    })
  } catch (err) {
    res.status(404).json({
      status: FAILED,
      message: err,
    })
  }
}

exports.createUser = async (req, res, next) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: FAILED,
      message: err,
    })
  }
}

exports.updateUser = async (req, res, next) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: FAILED,
      message: err,
    })
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: SUCCESS,
      data: null,
    })
  } catch (err) {
    res.status(404).json({
      status: FAILED,
      message: err,
    })
  }
}
