import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container, Form, Button, Badge, Dropdown } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, switchMode, theme, setTheme } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggleMode = async () => {
    try {
      const newMode = await switchMode();
      if (newMode === 'PROVIDER') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Failed to toggle profile mode:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Safe avatar builder supporting local uploads and remote init URLs
  const getAvatarUrl = (usr) => {
    if (!usr || !usr.avatar) return 'https://ui-avatars.com/api/?name=User';
    return usr.avatar.startsWith('http') ? usr.avatar : `http://localhost:5000${usr.avatar}`;
  };

  return (
    <BsNavbar expand="lg" className="navbar-custom py-3 sticky-top">
      <Container>
        {/* Modern Vector Brand Logo */}
        <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center fw-bold text-decoration-none" style={{ fontSize: '1.5rem' }}>
          <span className="logo-container">
            <i className="fa-solid fa-rotate me-2 animate-spin-slow"></i> ReLoop
          </span>
        </BsNavbar.Brand>
        
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" className="border-0 bg-transparent" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto align-items-center">
            {user ? (
              user.activeMode === 'PROVIDER' ? (
                <>
                  <Nav.Link as={Link} to="/dashboard" className={`px-3 py-2 fw-semibold ${location.pathname === '/dashboard' ? 'text-success' : 'text-secondary'}`}>
                    <i className="fa-solid fa-chart-pie me-1.5 text-success"></i> Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/create" className={`px-3 py-2 fw-semibold ${location.pathname === '/create' ? 'text-success' : 'text-secondary'}`}>
                    <i className="fa-solid fa-circle-plus me-1.5 text-success"></i> List New Item
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} to="/" className={`px-3 py-2 fw-semibold ${location.pathname === '/' ? 'text-primary' : 'text-secondary'}`}>
                  <i className="fa-solid fa-compass me-1.5 text-primary"></i> Explore Items
                </Nav.Link>
              )
            ) : (
              <Nav.Link as={Link} to="/" className="px-3 py-2 fw-semibold text-primary">
                <i className="fa-solid fa-compass me-1.5"></i> Explore Items
              </Nav.Link>
            )}
          </Nav>
          
          <Nav className="align-items-center gap-2">
            {/* Theme Selector Dropdown */}
            <Dropdown className="me-1" align="end">
              <Dropdown.Toggle variant="outline-secondary" size="sm" className="rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5 border-1 shadow-xs">
                <i className="fa-solid fa-palette text-primary"></i>
                <span className="d-none d-md-inline small fw-bold">Theme</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="shadow-lg border-0 mt-2" style={{ minWidth: '180px' }}>
                <Dropdown.Item onClick={() => setTheme('theme-light')} className="d-flex align-items-center justify-content-between">
                  <span>☀️ Light Tech</span>
                  {theme === 'theme-light' && <i className="fa-solid fa-check text-primary"></i>}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setTheme('theme-dark-cyber')} className="d-flex align-items-center justify-content-between">
                  <span>🌙 Midnight Cyber</span>
                  {theme === 'theme-dark-cyber' && <i className="fa-solid fa-check text-primary"></i>}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setTheme('theme-sunset')} className="d-flex align-items-center justify-content-between">
                  <span>🌅 Sunset Warmth</span>
                  {theme === 'theme-sunset' && <i className="fa-solid fa-check text-primary"></i>}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setTheme('theme-forest')} className="d-flex align-items-center justify-content-between">
                  <span>🌲 Forest Eco</span>
                  {theme === 'theme-forest' && <i className="fa-solid fa-check text-primary"></i>}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setTheme('theme-synthwave')} className="d-flex align-items-center justify-content-between">
                  <span>🌌 Neon Synthwave</span>
                  {theme === 'theme-synthwave' && <i className="fa-solid fa-check text-primary"></i>}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setTheme('theme-ocean')} className="d-flex align-items-center justify-content-between">
                  <span>🌊 Ocean Wave</span>
                  {theme === 'theme-ocean' && <i className="fa-solid fa-check text-primary"></i>}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {user ? (
              <>
                {/* Switch to Provider Toggle Switch */}
                <Form.Group className="d-flex align-items-center me-3 my-2 my-lg-0">
                  <Form.Check 
                    type="switch"
                    id="provider-switch"
                    label={
                      <span className={`fw-bold small ${user.activeMode === 'PROVIDER' ? 'text-success' : 'text-secondary'}`}>
                        {user.activeMode === 'PROVIDER' ? '🛠️ Provider Mode' : 'Switch to Provider'}
                      </span>
                    }
                    checked={user.activeMode === 'PROVIDER'}
                    onChange={handleToggleMode}
                    className="fs-6"
                  />
                </Form.Group>

                {/* Messages quick-link badge */}
                <Button as={Link} to="/messages" variant="link" className={`p-2 me-2 position-relative ${location.pathname === '/messages' ? 'text-primary' : 'text-secondary'}`}>
                  <i className="fa-solid fa-envelope fs-5"></i>
                </Button>

                {/* User Dropdown Account Panel */}
                <Dropdown align="end">
                  <Dropdown.Toggle as="div" className="d-flex align-items-center cursor-pointer" role="button" id="dropdown-user-panel">
                    <img 
                      src={getAvatarUrl(user)} 
                      alt={user.name} 
                      className="avatar-circle me-2 shadow-sm"
                      style={{ width: '38px', height: '38px' }}
                    />
                    <div className="d-none d-md-block text-start me-1">
                      <div className="fw-bold small lh-1 mb-0.5 text-dark">{user.name}</div>
                      <Badge bg="warning" className="text-dark fw-extrabold" style={{ fontSize: '0.65rem' }}>
                        ⭐ {user.trustScore?.toFixed(1) || '5.0'}
                      </Badge>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="mt-2 border-0 shadow-lg">
                    <Dropdown.Header className="fw-bold border-bottom pb-2 mb-2 d-flex align-items-center" style={{ borderBottomColor: 'var(--border-color) !important' }}>
                      <img 
                        src={getAvatarUrl(user)} 
                        alt={user.name} 
                        className="avatar-circle me-2"
                        style={{ width: '30px', height: '30px' }}
                      />
                      <div>
                        <div className="lh-1 mb-0.5 text-dark">{user.name}</div>
                        <span className="text-muted small fw-normal">{user.email}</span>
                      </div>
                    </Dropdown.Header>
                    <Dropdown.Item as={Link} to="/profile">
                      <i className="fa-regular fa-id-card me-2 text-muted"></i> My Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/dashboard">
                      <i className="fa-solid fa-list-check me-2 text-muted"></i> My Listings
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/messages">
                      <i className="fa-regular fa-comment-dots me-2 text-muted"></i> Messages
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/history">
                      <i className="fa-solid fa-clock-rotate-left me-2 text-muted"></i> Dealings History
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/profile">
                      <i className="fa-solid fa-sliders me-2 text-muted"></i> Settings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      <i className="fa-solid fa-power-off me-2"></i> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <Button as={Link} to="/login" variant="primary" className="rounded-pill px-4 shadow-sm fw-bold">
                <i className="fa-solid fa-right-to-bracket me-1.5"></i> Join ReLoop
              </Button>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
