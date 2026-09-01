import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Toast, ToastContainer } from 'react-bootstrap';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ItemDetail from './pages/ItemDetail';
import CreateListing from './pages/CreateListing';
import Login from './pages/Login';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import DealingsHistory from './pages/DealingsHistory';

function AppContent() {
  const { toast, hideToast } = useContext(AuthContext);

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 position-relative">
        {/* Animated Background Decorator Blobs */}
        <div className="bg-decorator blob-1"></div>
        <div className="bg-decorator blob-2"></div>
        <div className="bg-decorator blob-3"></div>
        <div className="bg-decorator blob-4"></div>
        
        {/* Abstract Background Shapes & Grids */}
        <div className="shape-ring-1"></div>
        <div className="shape-ring-2"></div>
        <div className="shape-dots-1"></div>
        <div className="shape-dots-2"></div>

        {/* Playful Child-Attractive Background Elements */}
        {/* Smiling Cartoon Sun */}
        <div className="kid-shape kid-sun">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="20" fill="#facc15" />
            <path d="M40 5V15M40 65V75M5 40H15M65 40H75M15 15L22 22M58 58L65 65M15 65L22 58M58 22L65 15" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
            <circle cx="34" cy="36" r="2.5" fill="#1e293b" />
            <circle cx="46" cy="36" r="2.5" fill="#1e293b" />
            <path d="M34 46C34 46 37 50 40 50C43 50 46 46 46 46" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Rosy-Cheeked Cloud 1 */}
        <div className="kid-shape kid-cloud-1">
          <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 45C18.9543 45 10 36.0457 10 25C10 15.6569 16.4259 7.81882 25.122 5.5614C29.6202 2.06283 35.2635 0 41.3793 0C52.4828 0 61.7655 6.77259 65.556 16.2754C68.4239 15.4484 71.4583 15 74.5833 15C88.6204 15 100 26.1929 100 40C100 53.8071 88.6204 65 74.5833 65H30V45Z" fill="#e2e8f0" opacity="0.85" />
            <circle cx="40" cy="32" r="3" fill="#475569" />
            <circle cx="56" cy="32" r="3" fill="#475569" />
            <circle cx="34" cy="36" r="3" fill="#fda4af" />
            <circle cx="62" cy="36" r="3" fill="#fda4af" />
            <path d="M44 40C44 40 46 43 48 43C50 43 52 40 52 40" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Rosy-Cheeked Cloud 2 */}
        <div className="kid-shape kid-cloud-2">
          <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 45C18.9543 45 10 36.0457 10 25C10 15.6569 16.4259 7.81882 25.122 5.5614C29.6202 2.06283 35.2635 0 41.3793 0C52.4828 0 61.7655 6.77259 65.556 16.2754C68.4239 15.4484 71.4583 15 74.5833 15C88.6204 15 100 26.1929 100 40C100 53.8071 88.6204 65 74.5833 65H30V45Z" fill="#e2e8f0" opacity="0.85" />
            <circle cx="40" cy="32" r="3" fill="#475569" />
            <circle cx="56" cy="32" r="3" fill="#475569" />
            <circle cx="34" cy="36" r="3" fill="#fda4af" />
            <circle cx="62" cy="36" r="3" fill="#fda4af" />
            <path d="M44 40C44 40 46 43 48 43C50 43 52 40 52 40" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Teddy Bear / Toy Balloon 1 */}
        <div className="kid-shape kid-balloon-1">
          <svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="30" fill="#f43f5e" />
            <path d="M40 70L36 78H44L40 70Z" fill="#e11d48" />
            <path d="M40 78C35 90 45 102 40 115" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <path d="M22 25C25 18 32 15 32 15" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
            <circle cx="32" cy="40" r="2.5" fill="#ffffff" />
            <circle cx="48" cy="40" r="2.5" fill="#ffffff" />
            <path d="M37 48C37 48 38.5 51 40 51C41.5 51 43 48 43 48" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Toy Balloon 2 */}
        <div className="kid-shape kid-balloon-2">
          <svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="30" fill="#0ea5e9" />
            <path d="M40 70L36 78H44L40 70Z" fill="#0284c7" />
            <path d="M40 78C35 90 45 102 40 115" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <path d="M22 25C25 18 32 15 32 15" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
            <circle cx="32" cy="40" r="2.5" fill="#ffffff" />
            <circle cx="48" cy="40" r="2.5" fill="#ffffff" />
            <path d="M37 48C37 48 38.5 51 40 51C41.5 51 43 48 43 48" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Twinkling Star 1 */}
        <div className="kid-shape kid-star-1">
          <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.5 0L27.5 15L42.5 15L30 25L35 40L22.5 30L10 40L15 25L2.5 15L17.5 15Z" fill="#fbbf24" />
            <circle cx="18" cy="20" r="2" fill="#1e293b" />
            <circle cx="27" cy="20" r="2" fill="#1e293b" />
            <path d="M20 25C20 25 21.25 27 22.5 27C23.75 27 25 25 25 25" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Twinkling Star 2 */}
        <div className="kid-shape kid-star-2">
          <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.5 0L27.5 15L42.5 15L30 25L35 40L22.5 30L10 40L15 25L2.5 15L17.5 15Z" fill="#fbbf24" />
            <circle cx="18" cy="20" r="2" fill="#1e293b" />
            <circle cx="27" cy="20" r="2" fill="#1e293b" />
            <path d="M20 25C20 25 21.25 27 22.5 27C23.75 27 25 25 25 25" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Smiling Recycling Sprout */}
        <div className="kid-shape kid-sprout">
          <svg width="60" height="70" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 65C30 45 35 25 45 15" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" />
            <path d="M36 38C25 35 15 45 25 55C35 65 45 50 36 38Z" fill="#22c55e" />
            <path d="M38 28C48 20 58 30 50 40C42 50 32 40 38 28Z" fill="#4ade80" />
            <circle cx="28" cy="48" r="1.5" fill="#ffffff" />
            <circle cx="34" cy="48" r="1.5" fill="#ffffff" />
          </svg>
        </div>
        
        {/* Global Sticky Navigation bar */}
        <Navbar />
        
        {/* Main Layout Area */}
        <main className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/items/:id" element={<ItemDetail />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/create" 
              element={
                <PrivateRoute>
                  <CreateListing />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <PrivateRoute>
                  <DealingsHistory />
                </PrivateRoute>
              } 
            />

            {/* Fallback Redirection */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Global Toast Notifications */}
        <ToastContainer position="bottom-end" className="p-4" style={{ position: 'fixed', zIndex: 9999 }}>
          <Toast 
            show={toast.show} 
            onClose={hideToast} 
            delay={4000} 
            autohide 
            className="border-0 shadow-lg"
            style={{ 
              background: 'var(--bg-card)', 
              borderLeft: `4px solid ${toast.variant === 'danger' ? '#dc2626' : toast.variant === 'warning' ? '#d97706' : 'var(--primary-color)'}`,
              borderRadius: '1rem',
              color: 'var(--text-main)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)'
            }}
          >
            <Toast.Header closeButton={false} className="bg-transparent border-0 d-flex justify-content-between pt-3 px-3 pb-1" style={{ color: 'var(--text-main)' }}>
              <strong className="me-auto" style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                <i className={`fa-solid ${toast.variant === 'success' ? 'fa-circle-check text-success' : toast.variant === 'danger' ? 'fa-circle-xmark text-danger' : 'fa-circle-info text-info'} me-2`}></i>
                ReLoop Notification
              </strong>
              <button type="button" className="btn-close" onClick={hideToast} style={{ fontSize: '0.75rem' }}></button>
            </Toast.Header>
            <Toast.Body className="fw-semibold px-3 pb-3 pt-1 text-muted small">{toast.message}</Toast.Body>
          </Toast>
        </ToastContainer>

        {/* Premium Footer */}
        <footer className="py-4 mt-auto border-top" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-footer)' }}>
          <Container className="text-center text-secondary small">
            <p className="mb-1 fw-bold text-dark opacity-75">🔄 ReLoop — Peer-to-Peer Circular Economy Marketplace</p>
            <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>© {new Date().getFullYear()} ReLoop. Giving items a second life. What is not useful for you is a treasure for someone else.</p>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
