import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Table, Badge, Button, Modal, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const DealingsHistory = () => {
  const { user } = useContext(AuthContext);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchCompletedRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const completed = res.data.filter(r => r.status === 'COMPLETED');
      setCompletedRequests(completed);
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve dealings history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedRequests();
  }, []);

  const listingTypeBadge = (type) => {
    switch (type) {
      case 'DONATE':
        return <Badge bg="success" className="fw-semibold">DONATE</Badge>;
      case 'RENT':
        return <Badge bg="primary" className="fw-semibold">RENT</Badge>;
      case 'LEASE':
        return <Badge bg="warning text-dark" className="fw-semibold">LEASE</Badge>;
      default:
        return <Badge bg="secondary" className="fw-semibold">{type}</Badge>;
    }
  };

  const getAvatarUrl = (usr) => {
    if (!usr || !usr.avatar) return 'https://ui-avatars.com/api/?name=User';
    return usr.avatar.startsWith('http') ? usr.avatar : `http://localhost:5000${usr.avatar}`;
  };

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </Container>
    );
  }

  const currentUserId = user.id || user._id;

  return (
    <Container className="py-4 animate-fade-in">
      {/* Title Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ letterSpacing: '-0.5px', color: 'var(--primary-color)' }}>
            <i className="fa-solid fa-clock-rotate-left me-2"></i> Dealings History
          </h2>
          <p className="text-secondary small mb-0">Review all your completed item handovers, rents, and leases</p>
        </div>
        <Button as={Link} to="/messages" variant="outline-primary" className="mt-3 mt-sm-0 rounded-pill px-4 shadow-sm fw-bold">
          <i className="fa-solid fa-chevron-left me-1.5"></i> Back to Chats
        </Button>
      </div>

      {error && <Alert variant="danger" className="rounded-3 shadow-xs">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading history...</span>
          </div>
        </div>
      ) : completedRequests.length === 0 ? (
        <div className="glass-panel text-center p-5 d-flex flex-column align-items-center">
          <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 animate-pulse-slow" style={{ maxWidth: '100%' }}>
            <circle cx="110" cy="70" r="50" fill="var(--glow-color)" />
            <rect x="85" y="40" width="50" height="60" rx="4" stroke="var(--primary-color)" strokeWidth="4" fill="var(--bg-card)" />
            <line x1="95" y1="55" x2="115" y2="55" stroke="var(--primary-color)" strokeWidth="3" strokeLinecap="round" />
            <line x1="95" y1="68" x2="125" y2="68" stroke="var(--primary-color)" strokeWidth="3" strokeLinecap="round" />
            <line x1="95" y1="81" x2="120" y2="81" stroke="var(--primary-color)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="130" cy="90" r="14" fill="var(--accent-color)" stroke="var(--primary-color)" strokeWidth="2" />
            <path d="M125 90L128 93L135 86" stroke="var(--text-inverse)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M35 125C85 135 135 135 185 125" stroke="var(--border-color)" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <h4 className="fw-bold text-dark mb-2">No Past Dealings Found</h4>
          <p className="text-secondary max-width-400 mx-auto mb-4">
            Your dealings and transaction history will appear here once you complete item handovers with other users.
          </p>
          <Button as={Link} to="/messages" variant="primary" className="rounded-pill px-4">
            View Active Chats
          </Button>
        </div>
      ) : (
        <Card className="glass-card mb-5">
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0 align-middle">
              <thead className="text-secondary small text-uppercase" style={{ background: '#faf9f5' }}>
                <tr>
                  <th className="px-4 py-3">Item Details</th>
                  <th className="py-3">Type</th>
                  <th className="py-3">Your Role</th>
                  <th className="py-3">Transacted Partner</th>
                  <th className="py-3">Completed Date</th>
                  <th className="px-4 py-3 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {completedRequests.map((req) => {
                  const isSeller = req.seller?._id === currentUserId;
                  const partner = isSeller ? req.buyer : req.seller;
                  const completionDate = new Date(req.updatedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });

                  const getRowStyle = (type) => {
                    switch (type) {
                      case 'DONATE':
                        return { borderLeft: '4px solid #10b981', backgroundColor: 'rgba(16, 185, 129, 0.02)' };
                      case 'RENT':
                        return { borderLeft: '4px solid #4f46e5', backgroundColor: 'rgba(79, 70, 229, 0.02)' };
                      case 'LEASE':
                        return { borderLeft: '4px solid #f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.02)' };
                      default:
                        return { borderLeft: '4px solid var(--border-color)' };
                    }
                  };

                  return (
                    <tr key={req._id} style={getRowStyle(req.item?.listingType)}>
                      {/* Item Details */}
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <img
                            src={req.item?.images && req.item.images.length > 0 
                              ? `http://localhost:5000${req.item.images[0]}` 
                              : 'https://via.placeholder.com/80'
                            }
                            alt={req.item?.title || 'Item'}
                            className="rounded-3 me-3 object-fit-cover shadow-xs"
                            style={{ width: '50px', height: '50px', border: '1px solid var(--border-color)' }}
                          />
                          <div>
                            <Link to={`/items/${req.item?._id}`} className="fw-bold text-decoration-none d-block text-dark">
                              {req.item?.title || 'Deleted Item'}
                            </Link>
                            <span className="text-muted small text-uppercase" style={{ fontSize: '0.75rem' }}>
                              {req.item?.category || 'General'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Listing Type */}
                      <td className="py-3">
                        {listingTypeBadge(req.item?.listingType)}
                      </td>

                      {/* Role */}
                      <td className="py-3">
                        {isSeller ? (
                          <Badge bg="success-subtle" className="text-success border border-success px-2.5 py-1">Provider</Badge>
                        ) : (
                          <Badge bg="primary-subtle" className="text-primary border border-primary px-2.5 py-1">Claimant</Badge>
                        )}
                      </td>

                      {/* Partner details */}
                      <td className="py-3">
                        <div className="d-flex align-items-center">
                          <img
                            src={getAvatarUrl(partner)}
                            alt={partner?.name}
                            className="avatar-circle me-2 shadow-sm"
                            style={{ width: '28px', height: '28px' }}
                          />
                          <span className="fw-semibold text-dark">{partner?.name || 'Deleted User'}</span>
                        </div>
                      </td>

                      {/* Completion Date */}
                      <td className="py-3 text-secondary" style={{ fontSize: '0.9rem' }}>
                        {completionDate}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-end">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="rounded-pill px-3 fw-bold"
                          onClick={() => {
                            setSelectedRequest(req);
                            setShowChatModal(true);
                          }}
                        >
                          <i className="fa-regular fa-folder-open me-1.5"></i> View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Chat Archive Modal */}
      <Modal show={showChatModal} onHide={() => setShowChatModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ background: '#faf9f5', borderBottom: '1px solid var(--border-color)' }}>
          <Modal.Title className="fw-bold fs-5 text-dark">
            <i className="fa-solid fa-clock-rotate-left me-2 text-primary"></i> Deal Details & Chat Archive
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4" style={{ background: '#ffffff' }}>
          {selectedRequest && (
            <>
              {/* Item Info Summary Card */}
              <Card className="glass-card mb-4 border-0" style={{ background: '#faf9f5' }}>
                <Card.Body className="p-3 d-flex align-items-center">
                  <img
                    src={selectedRequest.item?.images && selectedRequest.item.images.length > 0
                      ? `http://localhost:5000${selectedRequest.item.images[0]}`
                      : 'https://via.placeholder.com/80'
                    }
                    alt={selectedRequest.item?.title}
                    className="rounded-3 me-3 object-fit-cover"
                    style={{ width: '70px', height: '70px', border: '1px solid var(--border-color)' }}
                  />
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="fw-bold mb-1 text-dark">{selectedRequest.item?.title || 'Unknown Item'}</h5>
                      {listingTypeBadge(selectedRequest.item?.listingType)}
                    </div>
                    <p className="text-secondary small mb-0">
                      Completed on: <strong className="text-dark">{new Date(selectedRequest.updatedAt).toLocaleDateString()}</strong>
                    </p>
                    <div className="d-flex gap-4 mt-2 small">
                      <span><strong>Provider:</strong> {selectedRequest.seller?.name}</span>
                      <span><strong>Claimant:</strong> {selectedRequest.buyer?.name}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Chat chronicle */}
              <h6 className="fw-bold mb-3 text-secondary text-uppercase tracking-wider small">Message Transcript</h6>
              <div className="chat-window border rounded-3 p-3 bg-light" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <div className="chat-messages-container">
                  <div className="text-center my-2 text-secondary opacity-75 small">
                    <i className="fa-regular fa-clock me-1"></i> Inquiry initiated on {new Date(selectedRequest.createdAt).toLocaleDateString()}
                  </div>
                  {selectedRequest.chat.map((msg, index) => {
                    const isMe = msg.sender === currentUserId;
                    const senderObj = msg.sender === selectedRequest.buyer?._id ? selectedRequest.buyer : selectedRequest.seller;
                    return (
                      <div key={index} className={`chat-bubble ${isMe ? 'sent' : 'received'} animate-fade-in`}>
                        <div className="fw-bold mb-1 text-secondary" style={{ fontSize: '0.7rem', display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                          {senderObj?.name || (isMe ? 'You' : 'Partner')}
                        </div>
                        <div>{msg.text}</div>
                        <div className="text-end small opacity-75 mt-1" style={{ fontSize: '0.65rem' }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={{ background: '#faf9f5', borderTop: '1px solid var(--border-color)' }}>
          <Button variant="secondary" className="rounded-pill px-4" onClick={() => setShowChatModal(false)}>
            Close Archive
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DealingsHistory;
