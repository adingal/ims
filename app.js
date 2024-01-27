const path = require('path')
const express = require('express')
const morgan = require('morgan')

const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

const userRouter = require('./routes/userRoutes')
const loadBoardRouter = require('./routes/loadBoardRoutes')
const historyRouter = require('./routes/historyRoutes')

// App
const app = express()

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Set public route
app.use(express.static(path.join(__dirname, 'public')))

// Set security HTTP headers
app.use(helmet())

// Limit request for 100 per hour same IP
const limiter = rateLimit({
  max: 999,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour.',
})
app.use('/api', limiter)

// Parse incoming request to JSON
app.use(express.json({ limit: '10kb' }))

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
)

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
