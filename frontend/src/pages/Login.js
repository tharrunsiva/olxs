import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login, register, user, showToast } = useContext(AuthContext);
  const navigate = useNavigate();

  // Tab control
  const [key, setKey] = useState('login');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Error/Loading states
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.activeMode === 'PROVIDER') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  // Handle avatar select
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Only image files are allowed for your profile photo.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Profile photo must be less than 2MB.');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regName || !regEmail || !regPhone || !regLocation || !regPassword || !regConfirmPassword) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', regName);
      formData.append('email', regEmail);
      formData.append('phone', regPhone);
      formData.append('locationName', regLocation);
      formData.append('password', regPassword);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await register(formData);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 my-3 animate-fade-in">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="glass-card overflow-hidden">
            <div className="text-white text-center py-4 px-3" style={{ background: 'var(--gradient-accent)' }}>
              <h2 className="fw-bold mb-1" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.2)' }}>
                <i className="fa-solid fa-rotate me-2 animate-spin-slow"></i> ReLoop
              </h2>
              <p className="small mb-0 opacity-85">Peer-to-Peer Circular Economy Marketplace</p>
            </div>
            
            <Card.Body className="p-4 p-md-5">
              {errorMsg && <Alert variant="danger" className="py-2.5 small rounded-3">{errorMsg}</Alert>}

              <Tabs
                id="auth-tabs"
                activeKey={key}
                onSelect={(k) => {
                  setKey(k);
                  setErrorMsg('');
                }}
                className="mb-4 nav-justified custom-tabs border-bottom"
                style={{ borderColor: 'var(--border-color) !important' }}
              >
                {/* LOGIN TAB */}
                <Tab eventKey="login" title={<span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Sign In</span>}>
                  <Form onSubmit={handleLoginSubmit} className="mt-3">
                    <Form.Group className="mb-3" controlId="loginEmail">
                      <Form.Label className="small fw-semibold text-secondary">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="py-2.5"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="loginPassword">
                      <Form.Label className="small fw-semibold text-secondary">Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="py-2.5"
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 py-2.5 fw-bold" disabled={loading}>
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </Form>
                </Tab>

                {/* SIGNUP TAB */}
                <Tab eventKey="register" title={<span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Create Account</span>}>
                  <Form onSubmit={handleRegisterSubmit} className="mt-3">
                    
                    {/* Avatar Upload */}
                    <Form.Group className="mb-4 text-center" controlId="regAvatar">
                      <div className="d-flex flex-column align-items-center">
                        <img
                          src={avatarPreview || 'https://ui-avatars.com/api/?name=ReLoop+User&background=faf8f3&color=3b4e6e'}
                          alt="Avatar preview"
                          className="avatar-circle shadow-sm mb-2"
                          style={{ width: '80px', height: '80px', border: '1px solid var(--border-color)' }}
                        />
                        <Form.Label className="btn btn-outline-secondary btn-sm rounded-pill px-3 cursor-pointer">
                          <i className="fa-solid fa-camera me-1"></i> Upload Photo
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="d-none"
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>

                    <Row className="g-3 mb-3">
                      <Col md={6}>
                        <Form.Group controlId="regName">
                          <Form.Label className="small fw-semibold text-secondary">Full Name *</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="John Doe"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="regEmail">
                          <Form.Label className="small fw-semibold text-secondary">Email Address *</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="john@example.com"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="g-3 mb-3">
                      <Col md={6}>
                        <Form.Group controlId="regPhone">
                          <Form.Label className="small fw-semibold text-secondary">Phone Number *</Form.Label>
                          <Form.Control
                            type="tel"
                            placeholder="e.g. +91 98765 43210"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="regLocation">
                          <Form.Label className="small fw-semibold text-secondary">City Location *</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="e.g. Coimbatore"
                            value={regLocation}
                            onChange={(e) => setRegLocation(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="g-3 mb-4">
                      <Col md={6}>
                        <Form.Group controlId="regPassword">
                          <Form.Label className="small fw-semibold text-secondary">Password *</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Min 6 characters"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="regConfirmPassword">
                          <Form.Label className="small fw-semibold text-secondary">Confirm Password *</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Verify password"
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button variant="primary" type="submit" className="w-100 py-2.5 fw-bold" disabled={loading}>
                      {loading ? 'Creating Account...' : 'Register'}
                    </Button>
                  </Form>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
