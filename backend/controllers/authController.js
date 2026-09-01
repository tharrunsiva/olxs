const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, locationName } = req.body;

    if (!name || !email || !password || !phone || !locationName) {
      return res.status(400).json({ message: 'All fields are required (name, email, password, phone, location).' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    // Set avatar path
    let avatar = '';
    if (req.file) {
      avatar = `/uploads/${req.file.filename}`;
    } else {
      // Default premium initials generator fallback
      avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&bold=true`;
    }

    user = new User({ 
      name, 
      email, 
      password, 
      phone, 
      locationName, 
      avatar 
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Sign JWT
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        locationName: user.locationName,
        avatar: user.avatar,
        trustScore: user.trustScore,
        activeMode: user.activeMode
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Sign JWT
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        locationName: user.locationName,
        avatar: user.avatar,
        trustScore: user.trustScore,
        activeMode: user.activeMode
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// Toggle Active Mode (EXPLORER / PROVIDER)
exports.switchMode = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.activeMode = user.activeMode === 'EXPLORER' ? 'PROVIDER' : 'EXPLORER';
    await user.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        locationName: user.locationName,
        avatar: user.avatar,
        trustScore: user.trustScore,
        activeMode: user.activeMode
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while switching mode.' });
  }
};

// Get current profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching profile.' });
  }
};
