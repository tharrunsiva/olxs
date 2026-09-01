const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  category: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  listingType: {
    type: String,
    enum: ['DONATE', 'RENT', 'LEASE'],
    required: true,
  },
  pricing: {
    dailyRate: {
      type: Number,
      default: 0,
    },
    monthlyRate: {
      type: Number,
      default: 0,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    }
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'PENDING', 'RENTED', 'DONATED'],
    default: 'AVAILABLE',
  },
  bookedDates: {
    type: [Date],
    default: [],
  },
  locationName: {
    type: String,
    required: true,
    default: 'Unknown Location',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0.0, 0.0],
      required: true,
    }
  }
}, {
  timestamps: true
});

// Create 2dsphere index for location-based queries
ItemSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Item', ItemSchema);
