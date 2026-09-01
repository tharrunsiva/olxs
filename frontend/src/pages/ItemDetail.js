import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Carousel, Button, Badge, Form, Alert, Modal } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ItemDetail = () => {
  const { id } = useParams();
  const { user, showToast } = useContext(AuthContext);
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Interest Modal states
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [hasSubmittedInterest, setHasSubmittedInterest] = useState(false);
  const [existingRequestId, setExistingRequestId] = useState(null);

  // Booking states (for Rent/Lease items)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch listing and interest request check
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/items/${id}`);
        setItem(res.data);
        
        // If logged in, check if user already submitted interest for this item
        if (user) {
          const token = localStorage.getItem('token');
          const requestsRes = await axios.get('http://localhost:5000/api/requests', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const existing = requestsRes.data.find(req => req.item?._id === id);
          if (existing) {
            setHasSubmittedInterest(true);
            setExistingRequestId(existing._id);
          }
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to load listing details.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id, user]);

  // Handle claim donation (Donations are claimed instantly)
  const handleClaim = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setActionLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/items/${id}/claim`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg(res.data.message);
      setItem(res.data.item);
      showToast('Item claimed! Status updated to PENDING.', 'success');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to claim item.');
      showToast('Error claiming item.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Interest Request (Buyer submits requirements)
  const handleInterestSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!interestMessage.trim()) {
      setErrorMsg('Please write a brief requirement message.');
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/requests', {
        itemId: id,
        message: interestMessage.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast('Interest submitted successfully! Seller notified.', 'success');
      setHasSubmittedInterest(true);
      setExistingRequestId(res.data._id);
      setShowInterestModal(false);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit interest.');
      showToast('Error submitting interest request.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Rent Booking
  const handleBooking = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!startDate || !endDate) {
      setErrorMsg('Please select both start and end dates.');
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/items/${id}/rent`, 
        { startDate, endDate }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg(res.data.message);
      setItem(res.data.item);
      showToast('Rental request logged! Status updated to PENDING.', 'success');
      setStartDate('');
      setEndDate('');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Booking failed.');
      showToast('Error booking item dates.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" style={{ color: 'var(--primary-color)' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger" className="rounded-3">Listing not found or was deleted.</Alert>
        <Button as={Link} to="/" variant="primary" className="rounded-pill mt-3">Back to Explore</Button>
      </Container>
    );
  }

  const isOwner = user && item.provider._id.toString() === (user.id || user._id);
  const isDonate = item.listingType === 'DONATE';
  const isRent = item.listingType === 'RENT';
  const isLease = item.listingType === 'LEASE';

  return (
    <Container className="py-5 animate-fade-in">
      {/* Back button */}
      <div className="mb-4">
        <Button as={Link} to="/" variant="link" className="p-0 text-secondary fw-bold text-decoration-none">
          <i className="fa-solid fa-arrow-left me-2"></i> Back to Explore
        </Button>
      </div>

      {successMsg && <Alert variant="success" className="mb-4 shadow-sm rounded-3">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger" className="mb-4 shadow-sm rounded-3">{errorMsg}</Alert>}

      <Row className="g-4">
        {/* Gallery Carousel & Description */}
        <Col lg={8}>
          {item.images && item.images.length > 0 ? (
            <Carousel className="rounded-4 overflow-hidden mb-4" interval={null} style={{ border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
              {item.images.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    className="d-block w-100 animate-fade-in"
                    src={`http://localhost:5000${img}`}
                    alt={`Slide ${idx + 1}`}
                    style={{ height: '480px', objectFit: 'cover' }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <div className="rounded-4 d-flex align-items-center justify-content-center mb-4" style={{ height: '480px', backgroundColor: '#faf9f5', border: '1px solid var(--border-color)' }}>
              <span className="text-muted fs-5">No images uploaded.</span>
            </div>
          )}

          <Card className="glass-panel p-4 mb-4">
            <div className="d-flex align-items-center mb-3">
              <Badge bg="secondary" className="me-2 text-uppercase font-extrabold" style={{ fontSize: '0.75rem' }}>{item.category}</Badge>
              <Badge bg={item.status === 'AVAILABLE' ? 'success' : 'warning'} className="text-uppercase font-extrabold" style={{ fontSize: '0.75rem' }}>
                {item.status}
              </Badge>
            </div>
            
            <h1 className="fw-bold text-dark mb-3" style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}>{item.title}</h1>
            
            <h5 className="fw-bold text-secondary mb-3 mt-4">Description</h5>
            <p className="text-muted lh-lg" style={{ whiteSpace: 'pre-line', fontSize: '0.98rem' }}>{item.description}</p>
            
            <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />

            <Row className="g-3">
              <Col sm={6}>
                <h6 className="fw-bold text-secondary small text-uppercase mb-1">📍 Address / Location</h6>
                <div className="text-dark fw-bold mb-2">
                  {item.locationName || 'Unknown Location'}
                </div>
                {item.location?.coordinates && (item.location.coordinates[0] !== 0 || item.location.coordinates[1] !== 0) && (
                  <div className="text-muted small font-monospace">
                    GPS: {item.location.coordinates[1].toFixed(4)}, {item.location.coordinates[0].toFixed(4)}
                  </div>
                )}
              </Col>
              <Col sm={6}>
                <h6 className="fw-bold text-secondary small text-uppercase mb-1">📅 Published Date</h6>
                <div className="text-dark small">
                  {new Date(item.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Action card */}
        <Col lg={4}>
          <div className="sticky-top" style={{ top: '100px', zIndex: 1 }}>
            
            <Card className="glass-card mb-4">
              <div className="p-4" style={{ background: '#faf9f5', borderBottom: '1px solid var(--border-color)' }}>
                <div className="small text-muted text-uppercase fw-bold mb-1">Price Rate</div>
                {isDonate && <h2 className="fw-extrabold mb-0" style={{ color: '#2f523c' }}>Free / Donation</h2>}
                {isRent && (
                  <div>
                    <h2 className="fw-extrabold text-dark mb-0">${item.pricing?.dailyRate} <span className="fs-6 text-muted">/ Day</span></h2>
                    {item.pricing?.securityDeposit > 0 && <div className="small mt-1" style={{ color: '#d07a5b' }}>Sec. Deposit: ${item.pricing?.securityDeposit}</div>}
                  </div>
                )}
                {isLease && (
                  <div>
                    <h2 className="fw-extrabold text-dark mb-0">${item.pricing?.monthlyRate} <span className="fs-6 text-muted">/ Month</span></h2>
                    {item.pricing?.securityDeposit > 0 && <div className="small mt-1" style={{ color: '#d07a5b' }}>Sec. Deposit: ${item.pricing?.securityDeposit}</div>}
                  </div>
                )}
              </div>

              <Card.Body className="p-4">
                {/* Provider details */}
                <div className="mb-4">
                  <h6 className="fw-bold text-secondary small text-uppercase mb-2">Item Provider</h6>
                  <div className="d-flex align-items-center p-3 rounded-3" style={{ background: '#ffffff', border: '1px solid var(--border-color)' }}>
                    <img 
                      src={
                        item.provider?.avatar
                          ? (item.provider.avatar.startsWith('http') ? item.provider.avatar : `http://localhost:5000${item.provider.avatar}`)
                          : 'https://ui-avatars.com/api/?name=Owner'
                      } 
                      alt="Provider" 
                      className="avatar-circle me-3 shadow-xs" 
                      style={{ width: '42px', height: '42px' }}
                    />
                    <div>
                      <div className="fw-bold text-dark">{item.provider?.name || 'Community Member'}</div>
                      <Badge bg="warning" className="text-dark py-1">
                        <i className="fa-solid fa-star me-1"></i> {item.provider?.trustScore?.toFixed(1) || '5.0'} Trust Score
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Claim/Rent Form Actions */}
                {user ? (
                  isOwner ? (
                    <Alert variant="info" className="text-center mb-0 rounded-3">
                      <i className="fa-solid fa-shield me-2"></i> This is your listing. Manage it on your <Link to="/dashboard" className="fw-bold">Dashboard</Link>.
                    </Alert>
                  ) : item.status === 'AVAILABLE' ? (
                    <div>
                      {/* Contact is restricted to Interest Messaging */}
                      {hasSubmittedInterest ? (
                        <div className="text-center">
                          <Alert variant="success" className="rounded-3 py-2 small mb-3">
                            <i className="fa-solid fa-check-double me-1"></i> Interest request submitted!
                          </Alert>
                          <Button as={Link} to="/messages" variant="outline-primary" className="w-100 py-2.5 rounded-3 fw-bold">
                            <i className="fa-regular fa-comments me-2"></i> Open Message Chat
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="primary" 
                          className="w-100 py-3 fw-bold rounded-3 shadow-sm btn-lg d-flex align-items-center justify-content-center"
                          onClick={() => {
                            setInterestMessage(`Hi ${item.provider.name || 'Seller'}, I am interested in your item "${item.title}". Can we coordinate a hand-off?`);
                            setShowInterestModal(true);
                          }}
                          disabled={actionLoading}
                        >
                          <i className="fa-solid fa-envelope-circle-check me-2"></i> I'm Interested 📬
                        </Button>
                      )}

                      {/* Claim for Donate */}
                      {isDonate && !hasSubmittedInterest && (
                        <Button 
                          variant="success" 
                          className="w-100 py-2.5 fw-bold rounded-3 mt-3"
                          onClick={handleClaim}
                          disabled={actionLoading}
                        >
                          Claim Instantly
                        </Button>
                      )}

                      {/* Rent Date-picker Schedule booking */}
                      {!isDonate && (
                        <Form onSubmit={handleBooking} className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                          <h6 className="fw-bold text-secondary small text-uppercase mb-3">Or Reserve Dates</h6>
                          <Form.Group className="mb-3" controlId="bookingStart">
                            <Form.Label className="small fw-semibold text-secondary">Start Date</Form.Label>
                            <Form.Control
                              type="date"
                              min={new Date().toISOString().split('T')[0]}
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              required
                            />
                          </Form.Group>
                          <Form.Group className="mb-4" controlId="bookingEnd">
                            <Form.Label className="small fw-semibold text-secondary">End Date</Form.Label>
                            <Form.Control
                              type="date"
                              min={startDate || new Date().toISOString().split('T')[0]}
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              required
                            />
                          </Form.Group>
                          <Button
                            variant="outline-primary"
                            type="submit"
                            className="w-100 py-2.5 fw-bold rounded-3"
                            disabled={actionLoading}
                          >
                            {actionLoading ? 'Booking...' : `Reserve Rental Booking`}
                          </Button>
                        </Form>
                      )}
                    </div>
                  ) : (
                    <Alert variant="secondary" className="text-center mb-0 rounded-3">
                      <i className="fa-solid fa-lock me-2"></i> Listing is <strong>{item.status}</strong>.
                    </Alert>
                  )
                ) : (
                  <div className="text-center p-3 rounded-3" style={{ background: '#faf9f5', border: '1px solid var(--border-color)' }}>
                    <p className="small text-secondary mb-3">You must be logged in to claim or submit interest.</p>
                    <Button as={Link} to="/login" variant="outline-primary" className="w-100 rounded-pill py-2">
                      Log In / Register
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Booked dates log */}
            {!isDonate && item.bookedDates && item.bookedDates.length > 0 && (
              <Card className="glass-card p-3 mb-4">
                <h6 className="fw-bold text-secondary small text-uppercase mb-2">
                  <i className="fa-regular fa-calendar-times text-danger me-1"></i> Blocked Rental Dates
                </h6>
                <div className="d-flex flex-wrap gap-1" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                  {item.bookedDates.map((date, idx) => (
                    <Badge key={idx} bg="light" className="py-1 px-2 font-monospace border text-secondary" style={{ fontSize: '0.75rem', borderColor: 'var(--border-color)' }}>
                      {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </Col>
      </Row>

      {/* Interest messaging modal */}
      <Modal show={showInterestModal} onHide={() => setShowInterestModal(false)} centered className="rounded-4">
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-bold text-dark">Submit Interest & Message seller</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleInterestSubmit}>
          <Modal.Body className="pt-2">
            <p className="text-muted small">
              Briefly describe your interest or hand-off requirements. This creates a secure private request.
            </p>
            <Form.Group controlId="interestMessage">
              <Form.Label className="small fw-semibold text-secondary">Your Message *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={interestMessage}
                onChange={(e) => setInterestMessage(e.target.value)}
                required
                maxLength={400}
                placeholder="Write your requirements here..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-top-0 pt-0">
            <Button variant="outline-secondary" onClick={() => setShowInterestModal(false)} className="rounded-pill px-4">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={actionLoading || !interestMessage.trim()} className="rounded-pill px-4">
              {actionLoading ? 'Sending...' : 'Send Message 📬'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ItemDetail;
