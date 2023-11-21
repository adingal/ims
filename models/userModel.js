const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name.'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      validator: function (el) {
        return el === this.password
      },
      message: 'Password are not the same.',
    },
    select: false,
  },
  lastLoggedIn: {
    type: Date,
    default: Date.now(),
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
  },
  // Hide version key
  __v: {
    type: Number,
    select: false,
  },
})

userSchema.pre('save', async function (next) {
  // Check if password is not modified
  if (!this.isModified('password')) return next()

  // If modified, encrypt and add a salt with length of 12
  this.password = await bcrypt.hash(this.password, 12)

  // Delete the passwordConfirm field before saving in DB
  // Only required in request body
  this.passwordConfirm = undefined
  next()
})

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User
