const mongoose = require('mongoose')
const User = require('./userModel')

const loadBoardSchema = new mongoose.Schema({
  serialNo: {
    type: String,
    required: [true, 'Please enter serial number.'],
    unique: true,
    maxLength: [4, 'A board name must have 4 characters.'],
    minLength: [4, 'A board name must have 4 characters.'],
  },
  status: {
    type: String,
    enum: ['IN', 'PRODUCTION', 'REPAIR'],
    uppercase: true,
    default: 'IN',
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
  type: {
    type: String,
    enum: ['X2', 'X4'],
    uppercase: true,
    default: 'X2',
  },
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: User,
  },
  addedDate: {
    type: Date,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    default: true,
  },
})

const LoadBoard = mongoose.model('LoadBoard', loadBoardSchema)

module.exports = LoadBoard
