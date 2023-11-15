const status = require('../constants')
const { SUCCESS, FAILED, ERROR } = status

exports.getAllUsers = async (req, res, next) => {
  res.status(200).json({
    status: SUCCESS,
    message: 'This route is not yet defined!',
    results: [],
    data: null,
  })
}

exports.getUser = async (req, res, next) => {
  res.status(200).json({
    status: SUCCESS,
    message: 'This route is not yet defined!',
    data: null,
  })
}

exports.createUser = async (req, res, next) => {
  res.status(200).json({
    status: SUCCESS,
    message: 'This route is not yet defined!',
    data: null,
  })
}

exports.updateUser = async (req, res, next) => {
  res.status(200).json({
    status: SUCCESS,
    message: 'This route is not yet defined!',
    data: null,
  })
}

exports.deleteUser = async (req, res, next) => {
  res.status(204).json({
    status: SUCCESS,
    message: 'This route is not yet defined!',
    data: null,
  })
}
