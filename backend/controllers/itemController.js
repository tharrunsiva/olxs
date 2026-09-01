const Item = require('../models/Item');

// Create a new listing
exports.createItem = async (req, res) => {
  try {
    const { title, description, category, listingType, dailyRate, monthlyRate, securityDeposit, locationName, longitude, latitude } = req.body;

    if (!title || !description || !category || !listingType || !locationName) {
      return res.status(400).json({ message: 'Please enter all required fields including location name.' });
    }

    // Process images
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // Parse location (GeoJSON expects [longitude, latitude])
    const coords = [
      parseFloat(longitude) || 0.0,
      parseFloat(latitude) || 0.0
    ];

    const item = new Item({
      title,
      description,
      category,
      listingType,
      images,
      provider: req.user.id,
      pricing: {
        dailyRate: parseFloat(dailyRate) || 0,
        monthlyRate: parseFloat(monthlyRate) || 0,
        securityDeposit: parseFloat(securityDeposit) || 0
      },
      locationName,
      location: {
        type: 'Point',
        coordinates: coords
      }
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating listing.' });
  }
};

// Get all items (where status is AVAILABLE) with filters
exports.getAllItems = async (req, res) => {
  try {
    const { type, category, search, locationName } = req.query;
    
    // Base query: only active/available items
    const query = { status: 'AVAILABLE' };

    // Apply optional listingType filter
    if (type && type !== 'ALL') {
      query.listingType = type.toUpperCase();
    }

    // Apply optional category filter
    if (category && category !== 'ALL') {
      query.category = category;
    }

    // Apply optional locationName filter
    if (locationName && locationName !== 'ALL') {
      query.locationName = { $regex: locationName, $options: 'i' };
    }

    // Apply optional text search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Item.find(query)
      .populate('provider', 'name trustScore')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving listings.' });
  }
};

// Get single item detail
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('provider', 'name trustScore');
    if (!item) {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching listing details.' });
  }
};

// Claim a donation item (DONATE)
exports.claimItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    if (item.listingType !== 'DONATE') {
      return res.status(400).json({ message: 'Only DONATE items can be claimed.' });
    }

    if (item.status !== 'AVAILABLE') {
      return res.status(400).json({ message: 'This item is no longer available.' });
    }

    item.status = 'PENDING';
    await item.save();

    res.json({ message: 'Item claimed successfully! Status updated to pending.', item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error claiming item.' });
  }
};

// Rent or Lease an item (RENT/LEASE)
exports.rentItem = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide both start and end dates.' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    if (item.listingType !== 'RENT' && item.listingType !== 'LEASE') {
      return res.status(400).json({ message: 'This item is not for rent or lease.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return res.status(400).json({ message: 'Invalid start or end date.' });
    }

    // Generate array of calendar days requested
    const datesToBook = [];
    let current = new Date(start);
    while (current <= end) {
      datesToBook.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    // Check overlap with already booked dates
    const bookedTimestamps = item.bookedDates.map(d => new Date(d).setUTCHours(0, 0, 0, 0));
    const requestedTimestamps = datesToBook.map(d => new Date(d).setUTCHours(0, 0, 0, 0));

    const hasOverlap = requestedTimestamps.some(t => bookedTimestamps.includes(t));
    if (hasOverlap) {
      return res.status(400).json({ message: 'Selected dates overlap with an existing booking.' });
    }

    // If valid, save booked dates to the database
    item.bookedDates.push(...datesToBook);
    
    // We can mark status as PENDING or keep it AVAILABLE for other dates.
    // Let's set it to PENDING to show booking request is initiated, as typical in P2P marketplaces
    item.status = 'PENDING'; 
    await item.save();

    res.json({ message: 'Rental request submitted successfully!', item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error processing booking.' });
  }
};

// Get listings created by the logged-in Provider
exports.getProviderItems = async (req, res) => {
  try {
    const items = await Item.find({ provider: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching your listings.' });
  }
};
