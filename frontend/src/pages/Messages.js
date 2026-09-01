import React, { useState, useEffect, useContext, useRef } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Form, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';


const Messages = () => {
  const { user, showToast } = useContext(AuthContext);
  
  const [requests, setRequests] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Track activeRequest in a ref to avoid stale closures in polling interval
  const activeRequestRef = useRef(activeRequest);
  useEffect(() => {
    activeRequestRef.current = activeRequest;
  }, [activeRequest]);

  // Message input state
  const [messageText, setMessageText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Chat window auto-scroll ref
  const chatEndRef = useRef(null);

  // Fetch all requests related to user
  const fetchRequests = async (autoSelectId = null) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
      
      const currentActive = activeRequestRef.current;
      const activeFiltered = res.data.filter(r => r.status !== 'COMPLETED');
      
      // Auto-select active request if matching ID or defaults to first
      if (activeFiltered.length > 0) {
        if (autoSelectId) {
          const matched = activeFiltered.find(r => r._id === autoSelectId);
          if (matched) {
            setActiveRequest(matched);
          } else {
            setActiveRequest(activeFiltered[0]);
          }
        } else if (!currentActive || currentActive.status === 'COMPLETED') {
          setActiveRequest(activeFiltered[0]);
        } else {
          // Sync active request details with re-fetched details
          const updated = activeFiltered.find(r => r._id === currentActive._id);
          if (updated) {
            setActiveRequest(updated);
          } else {
            setActiveRequest(activeFiltered[0]);
          }
        }
      } else {
        setActiveRequest(null);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve message threads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    
    // Set up a simple 5-second polling system for chat messages (lightweight real-time feeling)
    const interval = setInterval(() => {
      fetchRequests();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Scroll chat window to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeRequest?.chat]);

  // Handle status update (ACCEPT/REJECT/COMPLETE)
  const handleStatusUpdate = async (status) => {
    if (!activeRequest) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/requests/${activeRequest._id}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showToast(`Request ${status.toLowerCase()} successfully!`, 'success');
      // Update local request object
      setActiveRequest(res.data);
      // Refresh list
      fetchRequests(activeRequest._id);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to update request.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeRequest) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/requests/${activeRequest._id}/message`,
        { text: messageText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessageText('');
      setActiveRequest(res.data);
      fetchRequests(activeRequest._id);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to send message.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge bg="warning text-dark" className="badge-status">Pending</Badge>;
      case 'ACCEPTED':
        return <Badge bg="success" className="badge-status">Accepted</Badge>;
      case 'REJECTED':
        return <Badge bg="danger" className="badge-status">Rejected</Badge>;
      case 'COMPLETED':
        return <Badge bg="info text-dark" className="badge-status">Completed</Badge>;
      default:
        return <Badge bg="secondary" className="badge-status">{status}</Badge>;
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
  const activeRequests = requests.filter(req => req.status !== 'COMPLETED');

  return (
    <Container className="py-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ letterSpacing: '-0.5px', color: 'var(--primary-color)' }}>
            <i className="fa-solid fa-comments me-2"></i> Messages & Chats
          </h2>
          <p className="text-secondary small mb-0">Coordinate item handovers and transactions securely</p>
        </div>
        <Button as={Link} to="/history" variant="outline-primary" className="rounded-pill px-4 shadow-sm fw-bold">
          <i className="fa-solid fa-clock-rotate-left me-1.5"></i> Dealings History
        </Button>
      </div>

      {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading chats...</span>
          </div>
        </div>
      ) : activeRequests.length === 0 ? (
        <div className="glass-panel text-center p-5 d-flex flex-column align-items-center">
          <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 animate-pulse-slow" style={{ maxWidth: '100%' }}>
            <circle cx="110" cy="70" r="50" fill="var(--glow-color)" />
            <path d="M75 50C75 41.7157 81.7157 35 90 35H130C138.284 35 145 41.7157 145 50V75C145 83.2843 138.284 90 130 90H100L80 105V90C77 87 75 82 75 75V50Z" stroke="var(--primary-color)" strokeWidth="4" fill="var(--bg-card)" strokeLinejoin="round" />
            <circle cx="95" cy="62" r="3.5" fill="var(--primary-color)" />
            <circle cx="110" cy="62" r="3.5" fill="var(--primary-color)" />
            <circle cx="125" cy="62" r="3.5" fill="var(--primary-color)" />
            <circle cx="160" cy="100" r="8" fill="var(--accent-color)" opacity="0.8" />
            <path d="M35 125C85 135 135 135 185 125" stroke="var(--border-color)" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <h4 className="fw-bold text-dark mb-2">No Active Chats</h4>
          <p className="text-secondary max-width-400 mx-auto">
            You don't have any active inquiry or handover chats.
          </p>
          <Button as={Link} to="/" variant="primary" className="rounded-pill px-4 mt-3">
            Explore listings
          </Button>
        </div>
      ) : (
        <Row className="g-4">
          {/* LEFT PANEL: Requests list */}
          <Col md={5} lg={4}>
            <Card className="glass-card overflow-hidden" style={{ minHeight: '520px' }}>
              <div className="p-3" style={{ background: '#faf9f5', borderBottom: '1px solid var(--border-color)' }}>
                <span className="fw-bold text-secondary text-uppercase tracking-wider small">Inbox threads</span>
              </div>
              <ListGroup variant="flush" className="overflow-auto" style={{ maxHeight: '470px' }}>
                {activeRequests.map((req) => {
                  const isSeller = req.seller?._id === currentUserId;
                  const partner = isSeller ? req.buyer : req.seller;
                  const isActive = activeRequest && activeRequest._id === req._id;

                  return (
                    <ListGroup.Item
                      key={req._id}
                      action
                      onClick={() => setActiveRequest(req)}
                      className={`p-3 d-flex align-items-start border-bottom cursor-pointer ${isActive ? 'active' : ''}`}
                      style={{ borderBottomColor: 'var(--border-color) !important' }}
                    >
                      <img
                        src={getAvatarUrl(partner)}
                        alt={partner?.name}
                        className="avatar-circle me-3"
                        style={{ width: '42px', height: '42px' }}
                      />
                      <div className="w-100 overflow-hidden">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold text-dark text-truncate small me-1">{partner?.name}</span>
                          {getStatusBadge(req.status)}
                        </div>
                        <div className="fw-semibold text-truncate mb-1" style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>
                          {req.item?.title || 'Unknown Item'}
                        </div>
                        <div className="text-secondary opacity-75 text-truncate small" style={{ fontSize: '0.78rem' }}>
                          {req.chat.length > 0 ? req.chat[req.chat.length - 1].text : req.message}
                        </div>
                      </div>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Card>
          </Col>

          {/* RIGHT PANEL: Messaging Conversation */}
          <Col md={7} lg={8}>
            {activeRequest ? (
              <Card className="glass-card overflow-hidden d-flex flex-column" style={{ minHeight: '520px' }}>
                
                {/* Header info */}
                <div className="p-3 d-flex align-items-center justify-content-between" style={{ background: '#faf9f5', borderBottom: '1px solid var(--border-color)' }}>
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        activeRequest.item?.images && activeRequest.item.images.length > 0
                          ? `http://localhost:5000${activeRequest.item.images[0]}`
                          : 'https://via.placeholder.com/80'
                      }
                      alt={activeRequest.item?.title}
                      className="rounded me-3 object-fit-cover shadow-xs"
                      style={{ width: '46px', height: '46px', border: '1px solid var(--border-color)' }}
                    />
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">{activeRequest.item?.title}</h6>
                      <span className="text-muted small">
                        {activeRequest.seller?._id === currentUserId ? 'Client' : 'Seller'}:{' '}
                        <strong className="text-dark">
                          {activeRequest.seller?._id === currentUserId ? activeRequest.buyer?.name : activeRequest.seller?.name}
                        </strong>
                      </span>
                    </div>
                  </div>
                  
                  {getStatusBadge(activeRequest.status)}
                </div>

                {/* Status-driven Action workflows */}
                <Card.Body className="p-3 d-flex flex-column justify-content-between">
                  
                  {/* PENDING checks */}
                  {activeRequest.status === 'PENDING' && (
                    <div className="mb-3 animate-fade-in">
                      {activeRequest.seller?._id === currentUserId ? (
                        // Seller accept/reject actions
                        <Alert variant="warning" className="border-0 shadow-xs p-3 rounded-3 text-center mb-0 text-dark">
                          <h6 className="fw-bold mb-2">New Interest Inquiry!</h6>
                          <p className="small mb-3 text-dark-50">
                            <strong>{activeRequest.buyer?.name}</strong> wants to transact with this item. Accept to open a private message chat.
                          </p>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button 
                              variant="success" 
                              size="sm" 
                              className="rounded-pill px-4 shadow-sm fw-bold"
                              onClick={() => handleStatusUpdate('ACCEPTED')}
                              disabled={actionLoading}
                            >
                              <i className="fa-solid fa-check me-1"></i> Accept Request
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              className="rounded-pill px-4 shadow-sm fw-bold"
                              onClick={() => handleStatusUpdate('REJECTED')}
                              disabled={actionLoading}
                            >
                              <i className="fa-solid fa-times me-1"></i> Decline
                            </Button>
                          </div>
                        </Alert>
                      ) : (
                        // Buyer waiting banner
                        <Alert variant="info" className="border-0 shadow-xs p-3 rounded-3 text-center mb-0 text-dark">
                          <i className="fa-solid fa-hourglass-half me-2"></i>
                          Waiting for the listing provider to accept your request.
                        </Alert>
                      )}
                    </div>
                  )}

                  {/* REJECTED checks */}
                  {activeRequest.status === 'REJECTED' && (
                    <Alert variant="danger" className="text-center p-3 rounded-3 mb-3 border-0 text-dark animate-fade-in">
                      <i className="fa-solid fa-ban me-2"></i>
                      This request was declined by the seller.
                    </Alert>
                  )}

                  {/* COMPLETED checks */}
                  {activeRequest.status === 'COMPLETED' && (
                    <Alert variant="success" className="text-center p-2 rounded-3 mb-3 border-0 small fw-bold text-dark animate-fade-in">
                      <i className="fa-solid fa-circle-check me-1"></i> Transaction marked as completed.
                    </Alert>
                  )}

                  {/* CHAT CHRONICLE WINDOW */}
                  <div className="chat-window">
                    <div className="chat-messages-container">
                      
                      {/* Initial Message */}
                      <div className="text-center my-2 text-secondary opacity-75 small" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                        <i className="fa-regular fa-clock me-1"></i> Request started on {new Date(activeRequest.createdAt).toLocaleDateString()}
                      </div>
                      
                      {activeRequest.chat.map((msg, index) => {
                        const isMe = msg.sender === currentUserId;
                        return (
                          <div key={index} className={`chat-bubble ${isMe ? 'sent' : 'received'} animate-fade-in`}>
                            <div className="fw-bold mb-0.5 d-none" style={{ fontSize: '0.75rem' }}>
                              {isMe ? 'You' : 'Partner'}
                            </div>
                            <div>{msg.text}</div>
                            <div className="text-end small opacity-75 mt-1" style={{ fontSize: '0.65rem' }}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Text Input field */}
                    {activeRequest.status === 'ACCEPTED' && (
                      <Form onSubmit={handleSendMessage} className="p-2.5 d-flex gap-2" style={{ background: '#ffffff', borderTop: '1px solid var(--border-color)' }}>
                        <Form.Control
                          type="text"
                          placeholder="Type your message here..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="border-0 shadow-none px-3 bg-transparent text-dark"
                          style={{ fontSize: '0.9rem' }}
                          disabled={actionLoading}
                        />
                        <Button type="submit" variant="primary" className="rounded-circle d-flex align-items-center justify-content-center p-2.5" disabled={actionLoading || !messageText.trim()}>
                          <i className="fa-solid fa-paper-plane fs-6"></i>
                        </Button>
                      </Form>
                    )}
                  </div>

                  {/* Complete transaction button (For accepted status) */}
                  {activeRequest.status === 'ACCEPTED' && (
                    <div className="d-flex justify-content-end mt-3 pt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="rounded-pill fw-bold"
                        onClick={() => handleStatusUpdate('COMPLETED')}
                        disabled={actionLoading}
                      >
                        <i className="fa-solid fa-circle-check me-1"></i> Complete Deal / Handover
                      </Button>
                    </div>
                  )}

                </Card.Body>
              </Card>
            ) : (
              <div className="rounded-4 d-flex align-items-center justify-content-center" style={{ minHeight: '520px', background: '#faf9f5', border: '1px solid var(--border-color)' }}>
                <div className="text-center text-secondary">
                  <i className="fa-regular fa-envelope fs-1 mb-3"></i>
                  <p className="mb-0">Select a message thread from the inbox to start chatting.</p>
                </div>
              </div>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Messages;
