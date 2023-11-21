const { promisify } = require('util')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const { requestStatus } = require('../constants')

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true
  }

  // Send cookie to client
  res.cookie('jwt', token, cookieOptions)

  // Remove user password from the output
  user.password = undefined

  // Set login date
  user.lastLoggedIn = Date.now()

  res.status(statusCode).json({
    status: requestStatus.SUCCESS,
    token,
    data: {
      user,
    },
  })
}

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // 1. Check if email and password exist
  if (!email || !password) {
    return next(new AppError(`Please provide email and password.`, 404))
  }
  // 2. Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password')

  // If there's no user or password is incorrect
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(`Incorrect email or password.`, 401))
  }

  // 3. If everything is ok, send token to client
  createSendToken(user, 200, res)
})

exports.protect = catchAsync(async (req, res, next) => {
  let token
  // 1. Get token and check if it exist
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(
      new AppError(`You are not logged in. Please login to get access.`, 401),
    )
  }

  // 2. Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  // 3. Check if user still exist
  const currentUser = await User.findById(decoded.id)

  if (!currentUser) {
    return next(
      new AppError(`The user belonging to this token no longer exist.`),
    )
  }

  // Grant access to protected route
  req.user = currentUser
  next()
})

/* Authorization
 * - If not in roles array, cannot alter data
 ***********************************************************/
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'user']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You do not have permission to perform this action.`, 403),
      )
    }

    next()
  }
}
