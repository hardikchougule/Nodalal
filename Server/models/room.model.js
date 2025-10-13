// server/models/room.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  location: {
    type: String,
    required: true,
    trim: true
  },
  facility: {
    type: String,
    required: true,
    trim: true
  },
  images: {
    type: [String],
    validate: [val => val.length <= 3, 'You can upload a maximum of 3 images']
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // --- ADD THIS NEW FIELD ---
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment' // This creates a reference to our new Comment model
    }
  ]
  // --------------------------
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;