const path = require('path')
const express = require('express')
const morgan = require('morgan')
const userRouter = require('./routes/userRoutes')

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

module.exports = app
