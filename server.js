const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Insert config to process
dotenv.config({ path: './config.env' })

const app = require('./app')

// Connect to local DB
mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
  console.log('Local DB connection successful!')
})

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
