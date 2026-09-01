const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/requests
// @desc    Create a listing interest request (buyer clicks "I'm interested")
// @access  Private
router.post('/', authMiddleware, requestController.createRequest);

// @route   GET api/requests
// @desc    Get all requests associated with the logged-in user
// @access  Private
router.get('/', authMiddleware, requestController.getRequests);

// @route   GET api/requests/:id
// @desc    Get details and chat log of a single request
// @access  Private
router.get('/:id', authMiddleware, requestController.getRequestById);

// @route   PUT api/requests/:id/status
// @desc    Accept, reject or complete an interest request
// @access  Private
router.put('/:id/status', authMiddleware, requestController.updateRequestStatus);

// @route   POST api/requests/:id/message
// @desc    Send a chat message inside an accepted request
// @access  Private
router.post('/:id/message', authMiddleware, requestController.addChatMessage);

module.exports = router;
