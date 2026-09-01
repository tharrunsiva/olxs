const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// @route   POST api/items
// @desc    Create a circular economy listing (DONATE/RENT/LEASE)
// @access  Private (Provider)
router.post('/', authMiddleware, (req, res, next) => {
  upload.array('images', 5)(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    // Call controller upon successful upload checks
    itemController.createItem(req, res, next);
  });
});

// @route   GET api/items
// @desc    Get all listings with status AVAILABLE (supports filters)
// @access  Public
router.get('/', itemController.getAllItems);

// @route   GET api/items/my-listings
// @desc    Get listings created by the logged-in user
// @access  Private (Provider)
router.get('/my-listings', authMiddleware, itemController.getProviderItems);

// @route   GET api/items/:id
// @desc    Get details of a single item
// @access  Public
router.get('/:id', itemController.getItemById);

// @route   PUT api/items/:id/claim
// @desc    Claim a donation item (update status to PENDING)
// @access  Private (Explorer)
router.put('/:id/claim', authMiddleware, itemController.claimItem);

// @route   PUT api/items/:id/rent
// @desc    Rent or lease an item (conflict check for calendar dates)
// @access  Private (Explorer)
router.put('/:id/rent', authMiddleware, itemController.rentItem);

module.exports = router;
