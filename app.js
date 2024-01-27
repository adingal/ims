const path = require('path')
const express = require('express')
const morgan = require('morgan')
const userRouter = require('./routes/userRoutes')
const loadBoardRouter = require('./routes/loadBoardRoutes')
const historyRouter = require('./routes/historyRoutes')
const updateRouter = require('./routes/updateRoutes')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

// App
const app = express()

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Set public route
app.use(express.static(path.join(__dirname, 'public')))

// Parse incoming request to JSON
app.use(express.json({ limit: '10kb' }))

// Routes
app.use('/api/v1/users', userRouter)
app.use('/api/v1/loadboards', loadBoardRouter)
app.use('/api/v1/history', historyRouter)

// Catch all route handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

// Global error handling
app.use(globalErrorHandler)

module.exports = app
