const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: String,
    required: true,
  },
  locationName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  trustScore: {
    type: Number,
    default: 5.0,
  },
  activeMode: {
    type: String,
    enum: ['EXPLORER', 'PROVIDER'],
    default: 'EXPLORER',
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
