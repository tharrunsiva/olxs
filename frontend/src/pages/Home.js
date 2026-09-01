import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Card, Badge } from 'react-bootstrap';
import axios from 'axios';
import ItemCard from '../components/ItemCard';

const SkeletonLoader = () => (
  <Card className="glass-card h-100 border-0 overflow-hidden">
    <div className="skeleton-box" style={{ height: '200px' }}></div>
    <Card.Body className="p-3.5">
      <div className="skeleton-box mb-2" style={{ height: '12px', width: '35%' }}></div>
      <div className="skeleton-box mb-2.5" style={{ height: '20px', width: '85%' }}></div>
      <div className="skeleton-box mb-3" style={{ height: '40px', width: '100%' }}></div>
      <div className="skeleton-box mb-2" style={{ height: '14px', width: '60%' }}></div>
      <hr className="my-2" style={{ borderColor: 'var(--border-color)' }} />
      <div className="d-flex justify-content-between align-items-center pt-1">
        <div className="skeleton-box" style={{ height: '12px', width: '40%' }}></div>
        <div className="skeleton-box" style={{ height: '18px', width: '25%' }}></div>
      </div>
    </Card.Body>
  </Card>
);

const categoryIcons = {
  'ALL': '🌍 All',
  'Electronics': '🔌 Electronics',
  'Furniture': '🛋️ Furniture',
  'Books': '📚 Books',
  'Clothing': '👕 Clothing',
  'Sports': '⚽ Sports',
  'Other': '📦 Other'
};

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [listingType, setListingType] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [triggerFetch, setTriggerFetch] = useState(0);

  const categories = ['ALL', 'Electronics', 'Furniture', 'Books', 'Clothing', 'Sports', 'Other'];
  const types = ['ALL', 'DONATE', 'RENT', 'LEASE'];
  const locations = ['ALL', 'Coimbatore', 'Chennai', 'Bengaluru', 'Hyderabad', 'Trichy', 'Madurai'];

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (search) params.search = search;
        if (category !== 'ALL') params.category = category;
        if (listingType !== 'ALL') params.type = listingType;
        if (selectedLocation !== 'ALL') params.locationName = selectedLocation;

        const res = await axios.get('http://localhost:5000/api/items', { params });
        setItems(res.data);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Could not fetch items. Please check database connectivity.');
      } finally {
        // Add a tiny delay to show premium skeleton loader transitions
        setTimeout(() => {
          setLoading(false);
        }, 400);
      }
    };

    fetchItems();
  }, [category, listingType, selectedLocation, triggerFetch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setTriggerFetch(prev => prev + 1);
  };

  return (
    <Container className="py-5">
      {/* Modern Gradient Hero */}
      <div className="hero-section animate-fade-in">
        <Row className="align-items-center">
          <Col md={7} className="px-lg-5 text-center text-md-start">
            <Badge className="fw-bold px-3 py-2 mb-3 rounded-pill text-uppercase" style={{ background: 'rgba(59, 78, 110, 0.08)', color: 'var(--primary-color)', border: '1px solid rgba(59, 78, 110, 0.05)' }}>
              🔄 Peer-to-Peer Circular Economy
            </Badge>
            <h1 className="display-4 fw-extrabold mb-3" style={{ letterSpacing: '-1.5px', lineHeight: '1.15', color: 'var(--text-main)' }}>
              Reduce. Reuse. <span className="gradient-text">ReLoop.</span>
            </h1>
            <p className="lead text-secondary mb-4" style={{ fontSize: '1.1rem' }}>
              Give items a second life. What is not useful for you is a treasure for someone else. Search local listings to claim donations or lease items.
            </p>
            {/* Search Input Bar */}
            <Form onSubmit={handleSearchSubmit} className="max-width-500 mx-auto mx-md-0">
              <InputGroup className="rounded-pill overflow-hidden p-1.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <Form.Control
                  type="text"
                  placeholder="What are you looking for today? (e.g. laptop, chair)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-0 shadow-none px-4 py-2 bg-transparent"
                  style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}
                />
                <Button type="submit" variant="primary" className="rounded-pill px-4 fw-bold">
                  <i className="fa-solid fa-magnifying-glass me-1"></i> Search
                </Button>
              </InputGroup>
            </Form>
          </Col>
          <Col md={5} className="d-none d-md-block text-center px-lg-4">
            <img 
              src="/hero-tech.png" 
              alt="Circular Sharing Tech Economy Community" 
              className="hero-vector-image shadow-sm"
              style={{ border: '1px solid var(--border-color)' }}
            />
          </Col>
        </Row>
      </div>

      {/* Manual Location Filter Bar */}
      <div className="mb-4">
        <h6 className="fw-bold text-secondary mb-3 text-uppercase tracking-wider small">
          <i className="fa-solid fa-map-pin text-danger me-1.5"></i> Filter by City:
        </h6>
        <div className="horizontal-scroll-container">
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`location-filter-btn ${selectedLocation === loc ? 'active' : ''}`}
            >
              {loc === 'ALL' ? '🌍 All Locations' : loc}
            </button>
          ))}
        </div>
      </div>

      {/* Main filters panel */}
      <div className="glass-panel p-4 mb-5">
        <Row className="align-items-center g-4">
          {/* Action filters */}
          <Col lg={5}>
            <div className="fw-bold mb-3 text-secondary small text-uppercase tracking-wider">
              Listing Format:
            </div>
            <div className="d-flex gap-2 flex-wrap">
              {types.map((type) => (
                <Button
                  key={type}
                  variant={listingType === type ? 'primary' : 'outline-secondary'}
                  size="sm"
                  onClick={() => setListingType(type)}
                  className="rounded-pill px-3.5 py-1.5 fw-bold"
                >
                  {type === 'ALL' ? 'All Actions' : type}
                </Button>
              ))}
            </div>
          </Col>

          {/* Categories list */}
          <Col lg={7}>
            <div className="fw-bold mb-3 text-secondary small text-uppercase tracking-wider">
              Categories:
            </div>
            <div className="horizontal-scroll-container">
              {categories.map((cat) => {
                const getActiveCategoryClass = (c) => {
                  if (category !== c) return '';
                  switch (c) {
                    case 'Electronics': return 'active active-electronics';
                    case 'Furniture': return 'active active-furniture';
                    case 'Books': return 'active active-books';
                    case 'Clothing': return 'active active-clothing';
                    case 'Sports': return 'active active-sports';
                    case 'Other': return 'active active-other';
                    default: return 'active active-all';
                  }
                };
                return (
                  <div
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`category-pill ${getActiveCategoryClass(cat)}`}
                  >
                    {categoryIcons[cat] || cat}
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-5">
          {[1, 2, 3, 4].map((i) => (
            <Col key={i}>
              <SkeletonLoader />
            </Col>
          ))}
        </Row>
      ) : error ? (
        <div className="alert alert-danger text-center my-4 rounded-3 shadow-xs">{error}</div>
      ) : items.length === 0 ? (
        <div className="glass-panel text-center py-5 rounded-4 my-3 p-5 d-flex flex-column align-items-center">
          <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 animate-pulse-slow" style={{ maxWidth: '100%' }}>
            <circle cx="110" cy="70" r="50" fill="var(--glow-color)" />
            <circle cx="110" cy="70" r="40" stroke="var(--primary-color)" strokeWidth="3" strokeDasharray="6 6" />
            <circle cx="95" cy="55" r="20" stroke="var(--primary-color)" strokeWidth="4" fill="var(--bg-card)" />
            <line x1="109" y1="69" x2="135" y2="95" stroke="var(--primary-color)" strokeWidth="6" strokeLinecap="round" />
            <path d="M150 30L153 37L160 40L153 43L150 50L147 43L140 40L147 37L150 30Z" fill="var(--accent-color)" />
            <path d="M60 90L62 95L67 97L62 99L60 104L58 99L53 97L58 95L60 90Z" fill="var(--accent-color)" />
            <path d="M20 130C70 145 150 145 200 130" stroke="var(--border-color)" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <h4 className="fw-bold text-dark mb-2">No Listings Found</h4>
          <p className="text-secondary max-width-400 mx-auto">
            We couldn't find any circular economy listings matching your active filters.
          </p>
          <Button variant="outline-primary" onClick={() => { setSearch(''); setCategory('ALL'); setListingType('ALL'); setSelectedLocation('ALL'); }} className="rounded-pill mt-3 px-4">
            Reset Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0 text-secondary text-uppercase tracking-wider" style={{ fontSize: '0.85rem' }}>
              Listing items found ({items.length})
            </h5>
          </div>
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-5">
            {items.map((item) => (
              <Col key={item._id} className="animate-fade-in">
                <ItemCard item={item} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Home;
