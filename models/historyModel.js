const mongoose = require('mongoose')
const User = require('./userModel')

const historySchema = new mongoose.Schema({
  loadBoard: {
    type: String,
    required: [true, 'Loadboard serial number is required.'],
    maxLength: [4, 'A board name must have 4 characters.'],
    minLength: [4, 'A board name must have 4 characters.'],
  },
  status: {
    type: String,
    enum: ['IN', 'PRODUCTION', 'REPAIR'],
    uppercase: true,
    required: [true, 'Loadboard update must have a status.'],
  },
  location: {
    type: String,
    enum: [
      'MC01',
      'MC02',
      'MC03',
      'MC04',
      'MC05',
      'MC06',
      'MC07',
      'MC08',
      'MC09',
      'MC10',
    ],
    uppercase: true,
    default: null,
  },
  transactedBy: {
    type: mongoose.Schema.ObjectId,
    ref: User,
  },
  transactionDate: {
    type: Date,
    default: Date.now(),
  },
  __v: {
    type: Number,
    select: false,
  },
})

const History = mongoose.model('History', historySchema)

module.exports = History
