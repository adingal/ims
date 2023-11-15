const path = require('path')
const express = require('express')
const morgan = require('morgan')

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

module.exports = app
