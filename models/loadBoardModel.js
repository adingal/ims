const mongoose = require('mongoose')
const User = require('./userModel')

const loadBoardSchema = new mongoose.Schema({
  serialNo: {
    type: String,
    required: [true, 'Please enter serial number.'],
    unique: true,
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
      'MC1',
      'MC2',
      'MC3',
      'MC4',
      'MC5',
      'MC6',
      'MC7',
      'MC8',
      'MC9',
      'MC10',
    ],
    uppercase: true,
    default: 'AT1',
  },
  type: {
    type: String,
    enum: ['X2', 'X4'],
    default: 'X2',
  },
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: User,
    required: [true, 'Loadboard must be added by a user.'],
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
