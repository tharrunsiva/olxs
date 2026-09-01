import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/items/my-listings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyListings(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to retrieve your listings.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  // Compute Statistics #Tharrun
  const totalListings = myListings.length;
  const donateListings = myListings.filter(item => item.listingType === 'DONATE').length;
  const rentListings = myListings.filter(item => item.listingType === 'RENT').length;
  const leaseListings = myListings.filter(item => item.listingType === 'LEASE').length;
  
  const availableCount = myListings.filter(item => item.status === 'AVAILABLE').length;
  const pendingCount = myListings.filter(item => item.status === 'PENDING').length;

  return (
    <Container className="py-4">
      {/* Title Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ letterSpacing: '-0.5px', color: 'var(--primary-color)' }}>
            <i className="fa-solid fa-chart-line me-2"></i> Provider Dashboard
          </h2>
          <p className="text-secondary small mb-0">Manage items you share with the community</p>
        </div>
        <Button as={Link} to="/create" variant="success" className="mt-3 mt-sm-0 rounded-pill px-4 shadow-sm fw-bold">
          <i className="fa-solid fa-circle-plus me-1.5"></i> List a New Item
        </Button>
      </div>

      {error && <Alert variant="danger" className="rounded-3 shadow-xs">{error}</Alert>}

      {/* Statistics Cards Row */}
      <Row className="row-cols-2 row-cols-md-3 row-cols-lg-6 g-3 mb-4">
        <Col>
          <Card className="glass-card h-100 text-center">
            <Card.Body className="p-3">
              <div className="text-muted small text-uppercase fw-semibold mb-1" style={{ fontSize: '0.7rem' }}>Total Listings</div>
              <h3 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>{totalListings}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="glass-card h-100 text-center">
            <Card.Body className="p-3">
              <div className="text-muted small text-uppercase fw-semibold mb-1" style={{ fontSize: '0.7rem' }}>Donations</div>
              <h3 className="fw-bold mb-0" style={{ color: '#2f523c' }}>{donateListings}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="glass-card h-100 text-center">
            <Card.Body className="p-3">
              <div className="text-muted small text-uppercase fw-semibold mb-1" style={{ fontSize: '0.7rem' }}>Rents</div>
              <h3 className="fw-bold mb-0" style={{ color: '#3b4e6e' }}>{rentListings}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="glass-card h-100 text-center">
            <Card.Body className="p-3">
              <div className="text-muted small text-uppercase fw-semibold mb-1" style={{ fontSize: '0.7rem' }}>Leases</div>
              <h3 className="fw-bold mb-0" style={{ color: '#d07a5b' }}>{leaseListings}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="glass-card h-100 text-center">
            <Card.Body className="p-3">
              <div className="text-muted small text-uppercase fw-semibold mb-1" style={{ fontSize: '0.7rem' }}>Available</div>
              <h3 className="fw-bold mb-0" style={{ color: '#2f523c' }}>{availableCount}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="glass-card h-100 text-center">
            <Card.Body className="p-3">
              <div className="text-muted small text-uppercase fw-semibold mb-1" style={{ fontSize: '0.7rem' }}>Pending</div>
              <h3 className="fw-bold mb-0" style={{ color: '#c2410c' }}>{pendingCount}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Listings Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : myListings.length === 0 ? (
        <div className="glass-panel text-center p-5 d-flex flex-column align-items-center">
          <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 animate-pulse-slow" style={{ maxWidth: '100%' }}>
            <rect x="75" y="45" width="70" height="60" rx="6" stroke="var(--primary-color)" strokeWidth="4" fill="var(--bg-card)" />
            <path d="M75 55H145" stroke="var(--primary-color)" strokeWidth="4" />
            <circle cx="110" cy="80" r="14" fill="var(--glow-color)" stroke="var(--primary-color)" strokeWidth="2" />
            <path d="M110 74V86" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" />
            <path d="M104 80H116" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="65" cy="115" r="8" fill="var(--accent-color)" opacity="0.8" />
            <circle cx="155" cy="35" r="10" fill="var(--accent-color)" opacity="0.8" />
            <path d="M35 125C85 135 135 135 185 125" stroke="var(--border-color)" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <h4 className="fw-bold text-dark mb-2">No Items Listed Yet</h4>
          <p className="text-secondary max-width-400 mx-auto mb-4">
            Share items you no longer require so other community members can claim or lease them.
          </p>
          <Button as={Link} to="/create" variant="success" className="rounded-pill px-4">
            Add Your First Listing
          </Button>
        </div>
      ) : (
        <Card className="glass-card mb-5">
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0 align-middle">
              <thead className="text-secondary small text-uppercase">
                <tr>
                  <th className="px-4 py-3">Listing Details</th>
                  <th className="py-3">Type</th>
                  <th className="py-3">Rates / Pricing</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Reserved Dates</th>
                  <th className="px-4 py-3 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {myListings.map((item) => (
                  <tr key={item._id}>
                    {/* Details */}
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <img
                          src={item.images && item.images.length > 0 ? `http://localhost:5000${item.images[0]}` : 'https://via.placeholder.com/80'}
                          alt={item.title}
                          className="rounded-3 me-3 object-fit-cover shadow-xs"
                          style={{ width: '60px', height: '60px', border: '1px solid var(--border-color)' }}
                        />
                        <div>
                          <Link to={`/items/${item._id}`} className="fw-bold text-decoration-none d-block" style={{ color: 'var(--text-main)' }}>
                            {item.title}
                          </Link>
                          <span className="text-muted small text-uppercase" style={{ fontSize: '0.75rem' }}>{item.category}</span>
                        </div>
                      </div>
                    </td>

                    {/* Format Badge */}
                    <td className="py-3">
                      <Badge bg={
                        item.listingType === 'DONATE' ? 'success' : 
                        item.listingType === 'RENT' ? 'primary' : 'warning text-dark'
                      } className="fw-semibold">
                        {item.listingType}
                      </Badge>
                    </td>

                    {/* Rates */}
                    <td className="py-3">
                      {item.listingType === 'DONATE' && <span className="fw-bold" style={{ color: '#2f523c' }}>Free</span>}
                      {item.listingType === 'RENT' && (
                        <div className="small text-dark">
                          <strong>Daily:</strong> ${item.pricing?.dailyRate || 0}<br/>
                          <span className="text-muted">Deposit: ${item.pricing?.securityDeposit || 0}</span>
                        </div>
                      )}
                      {item.listingType === 'LEASE' && (
                        <div className="small text-dark">
                          <strong>Monthly:</strong> ${item.pricing?.monthlyRate || 0}<br/>
                          <span className="text-muted">Deposit: ${item.pricing?.securityDeposit || 0}</span>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3">
                      <Badge bg={
                        item.status === 'AVAILABLE' ? 'success' : 
                        item.status === 'PENDING' ? 'warning text-dark' : 'secondary'
                      } className="py-1.5 px-2.5 rounded-pill font-weight-bold">
                        {item.status}
                      </Badge>
                    </td>

                    {/* Reserved dates log */}
                    <td className="py-3" style={{ maxWidth: '200px' }}>
                      {item.bookedDates && item.bookedDates.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1" style={{ maxHeight: '55px', overflowY: 'auto' }}>
                          {item.bookedDates.map((date, idx) => (
                            <Badge key={idx} bg="light" className="text-secondary border font-monospace py-0.5 px-1.5" style={{ fontSize: '0.7rem', borderColor: 'var(--border-color)', background: '#faf9f5', color: 'var(--text-main)' }}>
                              {new Date(date).toLocaleDateString()}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-secondary small">No active reservations</span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="px-4 py-3 text-end">
                      <Button as={Link} to={`/items/${item._id}`} variant="outline-primary" size="sm" className="rounded-pill px-3 fw-bold">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Dashboard;
