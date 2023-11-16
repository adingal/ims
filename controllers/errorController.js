const AppError = require('../utils/appError')

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value.`
  return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
  console.log('test')
  const errors = Object.values(err.errors).map(value => value.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    // Programming or other unknown error: don't leak details
    // 1) Log error
    console.log('Error', err)
    // 2) Send generic error
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.'
    })
  }
}

const handleJWTError = () =>
  new AppError(`Invalid token. Please login again.`, 401)

const handleJWTExpiredError = () =>
  new AppError(`Your token has expired. Please login again.`, 401)

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    // Development
    sendErrorDev(err, res)
  } else {
    // Production
    let error = { ...err }
    // CastError
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error)
    }
    // Duplicate fields error
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error)
    }
    // Validation error
    if (error?._message?.toLowerCase().includes('validation')) {
      error = handleValidationErrorDB(error)
    }
    // JWT error
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError()
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError()
    }

    sendErrorProd(error, res)
  }
}
