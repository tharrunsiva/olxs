import React, { useContext } from 'react';
import { Container, Row, Col, Card, Badge, Button, ListGroup } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const getAvatarUrl = (usr) => {
    if (!usr || !usr.avatar) return 'https://ui-avatars.com/api/?name=User';
    return usr.avatar.startsWith('http') ? usr.avatar : `http://localhost:5000${usr.avatar}`;
  };

  return (
    <Container className="py-5 animate-fade-in">
      <Row className="justify-content-center g-4">
        {/* Left Column: Avatar & Trust Card */}
        <Col md={4} lg={3}>
          <Card className="glass-card text-center p-4">
            <Card.Body className="p-0">
              <img
                src={getAvatarUrl(user)}
                alt={user.name}
                className="avatar-circle mb-3 shadow"
                style={{ width: '120px', height: '120px', borderWidth: '3px' }}
              />
              <h4 className="fw-bold text-dark mb-1">{user.name}</h4>
              <p className="text-muted small mb-3">{user.email}</p>
              
              <div className="mb-4">
                <Badge bg="warning" className="text-dark fw-extrabold py-2 px-3 fs-6 rounded-pill shadow-xs">
                  ⭐ {user.trustScore?.toFixed(1) || '5.0'} Trust Score
                </Badge>
              </div>

              <div className="pt-3 text-start small" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Account Mode:</span>
                  <Badge bg={user.activeMode === 'PROVIDER' ? 'success' : 'primary'} className="fw-bold px-2 py-1">
                    {user.activeMode}
                  </Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Member since:</span>
                  <span className="fw-semibold text-dark">July 2026</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Account Details Form */}
        <Col md={8} lg={7}>
          <Card className="glass-panel p-4">
            <Card.Body className="p-0">
              <h3 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>
                <i className="fa-regular fa-id-card me-2" style={{ color: 'var(--primary-color)' }}></i> Account Settings
              </h3>
              <p className="text-muted small mb-4">View and configure your community profile details</p>

              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item className="px-0 py-3 border-bottom" style={{ borderBottomColor: 'var(--border-color) !important' }}>
                  <Row>
                    <Col xs={4} className="text-secondary fw-semibold">Full Name</Col>
                    <Col xs={8} className="text-dark fw-bold">{user.name}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-3 border-bottom" style={{ borderBottomColor: 'var(--border-color) !important' }}>
                  <Row>
                    <Col xs={4} className="text-secondary fw-semibold">Email Address</Col>
                    <Col xs={8} className="text-secondary fw-semibold">{user.email}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-3 border-bottom" style={{ borderBottomColor: 'var(--border-color) !important' }}>
                  <Row>
                    <Col xs={4} className="text-secondary fw-semibold">Phone Number</Col>
                    <Col xs={8} className="text-dark fw-bold">{user.phone || 'Not Provided'}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-3 border-bottom" style={{ borderBottomColor: 'var(--border-color) !important' }}>
                  <Row>
                    <Col xs={4} className="text-secondary fw-semibold">Location / Address</Col>
                    <Col xs={8} className="text-secondary fw-semibold">{user.locationName || 'Not Provided'}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>

              {/* Extra profile cards */}
              <Row className="g-3 mt-2">
                <Col sm={6}>
                  <Card className="text-center p-3 rounded-3" style={{ background: '#faf9f5', border: '1px solid var(--border-color)' }}>
                    <h6 className="text-secondary mb-1 text-uppercase tracking-wider small">Circular Actions</h6>
                    <div className="fs-3 fw-bold" style={{ color: 'var(--primary-color)' }}>12 Items</div>
                    <Link to="/dashboard" className="small fw-semibold text-decoration-none mt-1 d-block" style={{ color: 'var(--primary-color)' }}>Manage Listings</Link>
                  </Card>
                </Col>
                <Col sm={6}>
                  <Card className="text-center p-3 rounded-3" style={{ background: '#faf9f5', border: '1px solid var(--border-color)' }}>
                    <h6 className="text-secondary mb-1 text-uppercase tracking-wider small">Active Chats</h6>
                    <div className="fs-3 fw-bold" style={{ color: '#2f523c' }}>3 Threads</div>
                    <Link to="/messages" className="small fw-semibold text-decoration-none mt-1 d-block" style={{ color: 'var(--primary-color)' }}>Open Messages</Link>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
