// server/models/user.model.js

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true // Removes whitespace from both ends
  },
  email: {
    type: String,
    required: true,
    unique: true, // Each email must be unique in the database
    trim: true,
    lowercase: true // Stores email in lowercase
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Role can only be one of these two values
    default: 'user' // If no role is specified, it defaults to 'user'
  }
}, {
  timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;