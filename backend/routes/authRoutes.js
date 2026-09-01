const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res, next) => {
  upload.single('avatar')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    authController.register(req, res, next);
  });
});

// @route   POST api/auth/login
// @desc    Login a user & get token
// @access  Public
router.post('/login', authController.login);

// @route   PUT api/auth/switch-mode
// @desc    Toggle between EXPLORER and PROVIDER modes
// @access  Private
router.put('/switch-mode', authMiddleware, authController.switchMode);

// @route   GET api/auth/me
// @desc    Get current user profile details
// @access  Private
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
