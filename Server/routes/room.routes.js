// server/routes/room.routes.js

const express = require('express');
const router = express.Router();

// Import middleware and controller
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const roomController = require('../controllers/room.controller');

// --- Routes for the base path: /api/rooms ---
router.route('/')
  // GET /api/rooms (Public: Get all rooms)
  .get(roomController.getAllRooms)
  // POST /api/rooms (Admin: Create a new room)
  .post([verifyToken, isAdmin], roomController.createRoom);

// --- Routes for a specific room by ID: /api/rooms/:id ---
router.route('/:id')
  // GET /api/rooms/:id (Public: Get a single room)
  .get(roomController.getRoomById)
  // PUT /api/rooms/:id (Owner: Update a room)
  .put([verifyToken, isAdmin], roomController.updateRoom)
  // DELETE /api/rooms/:id (Owner: Delete a room)
  .delete([verifyToken, isAdmin], roomController.deleteRoom);

// --- Route for comments on a specific room: /api/rooms/:id/comments ---
router.post('/:id/comments', verifyToken, roomController.createRoomComment);

module.exports = router;