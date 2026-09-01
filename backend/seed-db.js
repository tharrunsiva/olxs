const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Item = require('./models/Item');
const Request = require('./models/Request');

const MONGO_URI = 'mongodb://localhost:27017/reloop';

async function seed() {
  try {
    console.log('Connecting to Mongo at', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    await Request.deleteMany({});
    console.log('Cleared existing database entries.');

    // Create users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password', salt);

    const seller = new User({
      name: 'Jane Seller',
      email: 'seller@reloop.com',
      password: passwordHash,
      phone: '+1 555-0199',
      locationName: 'Downtown Seattle',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Seller&background=4f46e5&color=fff&bold=true',
      trustScore: 4.9,
      activeMode: 'PROVIDER'
    });
    await seller.save();

    const buyer = new User({
      name: 'John Buyer',
      email: 'buyer@reloop.com',
      password: passwordHash,
      phone: '+1 555-0122',
      locationName: 'Capitol Hill',
      avatar: 'https://ui-avatars.com/api/?name=John+Buyer&background=10b981&color=fff&bold=true',
      trustScore: 5.0,
      activeMode: 'EXPLORER'
    });
    await buyer.save();

    console.log('Created test users:', {
      buyer: buyer.email,
      seller: seller.email
    });

    // Create items
    const sofa = new Item({
      title: 'Premium Leather Sofa',
      description: 'A premium brown leather sofa in pristine condition.',
      category: 'Furniture',
      images: [],
      provider: seller._id,
      listingType: 'DONATE',
      pricing: { dailyRate: 0, monthlyRate: 0, securityDeposit: 0 },
      status: 'DONATED',
      locationName: seller.locationName,
      location: { type: 'Point', coordinates: [-122.3321, 47.6062] }
    });
    await sofa.save();

    const bike = new Item({
      title: 'Mountain Bike',
      description: 'Sturdy mountain bike with 21 speeds and front suspension.',
      category: 'Sports',
      images: [],
      provider: seller._id,
      listingType: 'RENT',
      pricing: { dailyRate: 15, monthlyRate: 0, securityDeposit: 50 },
      status: 'PENDING',
      locationName: seller.locationName,
      location: { type: 'Point', coordinates: [-122.3321, 47.6062] }
    });
    await bike.save();

    console.log('Created items.');

    // Create a COMPLETED request (Jane is Seller, John is Buyer)
    const completedReq = new Request({
      buyer: buyer._id,
      seller: seller._id,
      item: sofa._id,
      message: 'Hi Jane! I am very interested in this sofa. I can pick it up tomorrow.',
      status: 'COMPLETED',
      chat: [
        {
          sender: buyer._id,
          text: 'Hi Jane! I am very interested in this sofa. I can pick it up tomorrow.',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
          sender: seller._id,
          text: 'Sure John! You can pick it up at 3 PM.',
          createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000)
        },
        {
          sender: buyer._id,
          text: 'Great, see you then!',
          createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000)
        },
        {
          sender: seller._id,
          text: 'Thank you for the smooth handover!',
          createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000)
        }
      ]
    });
    await completedReq.save();

    // Create an ACCEPTED request (Jane is Seller, John is Buyer)
    const activeReq = new Request({
      buyer: buyer._id,
      seller: seller._id,
      item: bike._id,
      message: 'Can I rent this bike for the weekend?',
      status: 'ACCEPTED',
      chat: [
        {
          sender: buyer._id,
          text: 'Can I rent this bike for the weekend?',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          sender: seller._id,
          text: 'Yes, sure! It is $15 per day.',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
        }
      ]
    });
    await activeReq.save();

    console.log('Seeded completed and active dealing requests successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding DB:', err);
    process.exit(1);
  }
}

seed();
