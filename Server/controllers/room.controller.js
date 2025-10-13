// server/controllers/room.controller.js

const Room = require('../models/room.model');
const Comment = require('../models/comment.model');
const User = require('../models/user.model');

// server/controllers/room.controller.js

// ... (existing imports and functions)

// --- ADD THESE TWO NEW FUNCTIONS ---

// @desc    Update a room
// @access  Private (Admin who owns the room)
exports.updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if the logged-in admin is the one who created the room
    if (room.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Update the room with the new data from the request body
    room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a room
// @access  Private (Admin who owns the room)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check for ownership
    if (room.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await room.deleteOne(); // Use deleteOne() on the document

    res.json({ message: 'Room removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new room
// @access  Private (Admin only)
exports.createRoom = async (req, res) => {
  const { location, facility, images, contactNumber, capacity } = req.body;
  try {
    const newRoom = new Room({
      location,
      facility,
      images,
      contactNumber,
      capacity,
      createdBy: req.user.id 
    });
    const room = await newRoom.save();
    res.status(201).json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all rooms
// @access  Public
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single room by ID
// @access  Public
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('comments');
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Comment on a room
// @access  Private (Logged-in users only)
exports.createRoomComment = async (req, res) => {
  const { text } = req.body;
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    const user = await User.findById(req.user.id).select('name');
    const newComment = new Comment({
      text: text,
      author: {
        id: req.user.id,
        name: user.name,
      }
    });
    await newComment.save();
    room.comments.push(newComment._id);
    await room.save();
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};