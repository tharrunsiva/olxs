const Request = require('../models/Request');
const Item = require('../models/Item');

// Create a new Interest Request (Buyer clicks "I'm Interested")
exports.createRequest = async (req, res) => {
  try {
    const { itemId, message } = req.body;

    if (!itemId || !message) {
      return res.status(400).json({ message: 'Item ID and requirement message are required.' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    // Owner check
    if (item.provider.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot submit interest for your own item.' });
    }

    // Duplicate check
    const existingRequest = await Request.findOne({ buyer: req.user.id, item: itemId });
    if (existingRequest) {
      return res.status(400).json({ message: 'You have already submitted an interest request for this item.' });
    }

    const request = new Request({
      buyer: req.user.id,
      seller: item.provider,
      item: itemId,
      message,
      // Initialize the private chat with the buyer's requirement message
      chat: [{
        sender: req.user.id,
        text: message
      }]
    });

    await request.save();
    
    // Populate request info to return
    const populatedRequest = await Request.findById(request._id)
      .populate('buyer', 'name email avatar phone')
      .populate('seller', 'name email avatar phone')
      .populate('item', 'title images status pricing listingType');

    res.status(201).json(populatedRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while submitting interest.' });
  }
};

// Retrieve all requests for the logged-in user (both sent & received)
exports.getRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find requests where the user is either the buyer or the seller
    const requests = await Request.find({
      $or: [{ buyer: userId }, { seller: userId }]
    })
    .populate('buyer', 'name email avatar phone locationName')
    .populate('seller', 'name email avatar phone locationName')
    .populate('item', 'title images status pricing listingType')
    .sort({ updatedAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving messages.' });
  }
};

// Retrieve details of a single request
exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('buyer', 'name email avatar phone locationName')
      .populate('seller', 'name email avatar phone locationName')
      .populate('item', 'title images status pricing listingType');

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // Authorization check: User must be buyer or seller
    if (request.buyer._id.toString() !== req.user.id && request.seller._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to view this request.' });
    }

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching request details.' });
  }
};

// Seller accepts or rejects the interest request
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update.' });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // Role checks
    if (status === 'ACCEPTED' || status === 'REJECTED') {
      // Only the seller can accept or reject requests
      if (request.seller.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Only the listing owner can accept or reject requests.' });
      }
    } else if (status === 'COMPLETED') {
      // Buyer or seller can complete the deal
      if (request.buyer.toString() !== req.user.id && request.seller.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to update status.' });
      }
    }

    request.status = status;
    await request.save();

    // Synchronize item status with request status update
    const item = await Item.findById(request.item);
    if (item) {
      if (status === 'ACCEPTED') {
        item.status = 'PENDING';
      } else if (status === 'REJECTED') {
        item.status = 'AVAILABLE';
      } else if (status === 'COMPLETED') {
        if (item.listingType === 'DONATE') {
          item.status = 'DONATED';
        } else if (item.listingType === 'RENT' || item.listingType === 'LEASE') {
          item.status = 'RENTED';
        }
      }
      await item.save();
    }

    // If accepted/completed, we populate and return
    const populatedRequest = await Request.findById(request._id)
      .populate('buyer', 'name email avatar phone locationName')
      .populate('seller', 'name email avatar phone locationName')
      .populate('item', 'title images status pricing listingType');

    res.json(populatedRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating request status.' });
  }
};

// Send a chat message inside the request
exports.addChatMessage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Message text cannot be empty.' });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // Authorization check
    if (request.buyer.toString() !== req.user.id && request.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to send messages in this chat.' });
    }

    // Blocking messaging until accepted
    if (request.status !== 'ACCEPTED') {
      return res.status(400).json({ message: 'You can only send messages once the seller has accepted the request.' });
    }

    // Append message
    request.chat.push({
      sender: req.user.id,
      text: text.trim()
    });

    await request.save();

    const populatedRequest = await Request.findById(request._id)
      .populate('buyer', 'name email avatar phone locationName')
      .populate('seller', 'name email avatar phone locationName')
      .populate('item', 'title images status pricing listingType');

    res.json(populatedRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error sending message.' });
  }
};
