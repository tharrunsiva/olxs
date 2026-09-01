import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateListing = () => {
  const navigate = useNavigate();

  // Progress/Step state
  const [step, setStep] = useState(1);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [listingType, setListingType] = useState('DONATE');

  // Pricing (nested schema)
  const [dailyRate, setDailyRate] = useState('');
  const [monthlyRate, setMonthlyRate] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');

  // Location Details
  const [locationName, setLocationName] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');

  // Image Upload Files & Previews
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Alert message states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const categoriesList = ['Electronics', 'Furniture', 'Books', 'Clothing', 'Sports', 'Other'];

  // Handle files selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate sizes and formats
    const validFiles = [];
    const validPreviews = [];

    for (let file of selectedFiles) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Only image files are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Each image file size must be less than 5MB.');
        return;
      }
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    }

    setFiles(validFiles);
    setPreviews(validPreviews);
    setErrorMsg('');
  };

  // Get User Geolocation Coordinates
  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLongitude(position.coords.longitude.toString());
        setLatitude(position.coords.latitude.toString());
        setErrorMsg('');
      },
      (error) => {
        console.error(error);
        setErrorMsg('Failed to fetch your location. Please input coordinates manually.');
      }
    );
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Basic Validation
    if (!title || !description || !category) {
      setErrorMsg('Please complete all fields in Step 1.');
      setStep(1);
      return;
    }

    if (!locationName) {
      setErrorMsg('Please enter a location name in Step 3.');
      setStep(3);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('listingType', listingType);

      // Append type pricing
      if (listingType === 'RENT') {
        formData.append('dailyRate', dailyRate || '0');
        formData.append('securityDeposit', securityDeposit || '0');
      } else if (listingType === 'LEASE') {
        formData.append('monthlyRate', monthlyRate || '0');
        formData.append('securityDeposit', securityDeposit || '0');
      }

      formData.append('locationName', locationName);
      formData.append('longitude', longitude || '0.0');
      formData.append('latitude', latitude || '0.0');

      // Append image files
      files.forEach((file) => {
        formData.append('images', file);
      });

      // Get JWT from storage
      const token = localStorage.getItem('token');

      const res = await axios.post('http://localhost:5000/api/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setSuccessMsg('Listing created successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Error occurred while creating the listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 animate-fade-in" style={{ maxWidth: '750px' }}>
      {/* Progress indicators */}
      <Card className="glass-card mb-4 border-0">
        <Card.Body className="p-3">
          <ProgressBar now={(step / 3) * 100} label={`Step ${step} of 3`} className="mb-2" />
          <div className="d-flex justify-content-between text-light opacity-50 small px-1">
            <span className={step >= 1 ? 'fw-bold' : ''} style={{ color: step >= 1 ? 'var(--primary-color)' : '' }}>1. Info</span>
            <span className={step >= 2 ? 'fw-bold' : ''} style={{ color: step >= 2 ? 'var(--primary-color)' : '' }}>2. Category & Pricing</span>
            <span className={step >= 3 ? 'fw-bold' : ''} style={{ color: step >= 3 ? 'var(--primary-color)' : '' }}>3. Images & Location</span>
          </div>
        </Card.Body>
      </Card>

      {/* Main Listing Card Form */}
      <Card className="glass-card border-0 overflow-hidden">
        <div className="text-white py-4 px-4 d-flex align-items-center" style={{ background: 'var(--gradient-provider)' }}>
          <i className="fa-solid fa-circle-plus fs-3 me-3" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.2)' }}></i>
          <div>
            <h3 className="fw-bold mb-0 text-white" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.2)' }}>List a New Item</h3>
            <p className="small mb-0 opacity-85">List items to donate, rent, or lease within your community</p>
          </div>
        </div>

        <Card.Body className="p-4 p-md-5">
          {errorMsg && <Alert variant="danger" className="rounded-3">{errorMsg}</Alert>}
          {successMsg && <Alert variant="success" className="rounded-3">{successMsg}</Alert>}

          <Form onSubmit={handleSubmit}>
            
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <div>
                <h4 className="fw-bold mb-4 text-secondary">Step 1: Basic Listing Information</h4>
                
                <Form.Group className="mb-3" controlId="listingTitle">
                  <Form.Label className="fw-semibold text-secondary">Listing Title *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter a short, descriptive title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="listingCategory">
                  <Form.Label className="fw-semibold text-secondary">Category *</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select a category</option>
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4" controlId="listingDesc">
                  <Form.Label className="fw-semibold text-secondary">Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Describe your item's condition, guidelines, and context."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={1000}
                    required
                  />
                  <Form.Text className="text-muted d-block text-end mt-1">
                    {description.length}/1000 characters
                  </Form.Text>
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button variant="success" onClick={() => setStep(2)} disabled={!title || !description || !category}>
                    Next: Pricing <i className="fa-solid fa-arrow-right ms-1"></i>
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: Listing Type & Pricing */}
            {step === 2 && (
              <div>
                <h4 className="fw-bold mb-4 text-secondary">Step 2: Listing Type & Pricing</h4>

                <Form.Group className="mb-4" controlId="listingType">
                  <Form.Label className="fw-semibold text-secondary">Listing Format *</Form.Label>
                  <Form.Select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value)}
                    required
                  >
                    <option value="DONATE">Donate (Free)</option>
                    <option value="RENT">Rent (Daily rate)</option>
                    <option value="LEASE">Lease (Monthly rate)</option>
                  </Form.Select>
                </Form.Group>

                {/* Conditional Pricing Fields */}
                {listingType === 'DONATE' && (
                  <Alert variant="info" className="mb-4 text-dark">
                    <i className="fa-solid fa-circle-info me-2"></i>
                    <strong>Donation:</strong> This item will be listed for free. People can claim it instantly. No deposit or rental charges.
                  </Alert>
                )}

                {listingType === 'RENT' && (
                  <Row className="g-3 mb-4">
                    <Col md={6}>
                      <Form.Group controlId="dailyRate">
                        <Form.Label className="fw-semibold text-secondary">Daily Rent Rate ($) *</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          placeholder="e.g. 15"
                          value={dailyRate}
                          onChange={(e) => setDailyRate(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="securityDepositRent">
                        <Form.Label className="fw-semibold text-secondary">Security Deposit ($)</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          placeholder="e.g. 50"
                          value={securityDeposit}
                          onChange={(e) => setSecurityDeposit(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                {listingType === 'LEASE' && (
                  <Row className="g-3 mb-4">
                    <Col md={6}>
                      <Form.Group controlId="monthlyRate">
                        <Form.Label className="fw-semibold text-secondary">Monthly Lease Rate ($) *</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          placeholder="e.g. 200"
                          value={monthlyRate}
                          onChange={(e) => setMonthlyRate(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="securityDepositLease">
                        <Form.Label className="fw-semibold text-secondary">Security Deposit ($)</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          placeholder="e.g. 100"
                          value={securityDeposit}
                          onChange={(e) => setSecurityDeposit(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <div className="d-flex justify-content-between">
                  <Button variant="outline-secondary" onClick={() => setStep(1)}>
                    <i className="fa-solid fa-arrow-left me-1"></i> Back
                  </Button>
                  <Button variant="success" onClick={() => setStep(3)}>
                    Next: Media & Location <i className="fa-solid fa-arrow-right ms-1"></i>
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Images & Location */}
            {step === 3 && (
              <div>
                <h4 className="fw-bold mb-4 text-secondary">Step 3: Images & Geolocation</h4>

                {/* Multiple Image Input */}
                <Form.Group className="mb-4" controlId="listingImages">
                  <Form.Label className="fw-semibold text-secondary">Upload Images (Up to 5 images, Max 5MB each) *</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    required={files.length === 0}
                  />
                  {/* Image Thumbnails Previews */}
                  {previews.length > 0 && (
                    <div className="image-preview-container mt-3">
                      {previews.map((src, i) => (
                        <div key={i} className="image-preview-wrapper" style={{ border: '1px solid var(--border-color)' }}>
                          <img src={src} className="image-preview-thumbnail" alt="Preview" />
                        </div>
                      ))}
                    </div>
                  )}
                </Form.Group>

                {/* Manual Location Name Input */}
                <Form.Group className="mb-4" controlId="locationName">
                  <Form.Label className="fw-semibold text-secondary">Location / Address (City & State) *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Coimbatore, Tamil Nadu"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Enter the location where the item is located.
                  </Form.Text>
                </Form.Group>

                {/* Optional Geolocation Section */}
                <h5 className="fw-semibold text-secondary mb-2">Location Coordinates (Optional)</h5>
                <p className="text-muted small mb-3">
                  You can optionally fetch GPS coordinates for maps, or leave them empty.
                </p>

                <div className="p-3 rounded-3 mb-4" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
                  <Button variant="outline-primary" size="sm" className="mb-3 d-flex align-items-center" onClick={fetchCurrentLocation}>
                    <i className="fa-solid fa-location-crosshairs me-2"></i> Use Current Coordinates
                  </Button>

                  <Row className="g-3">
                    <Col xs={6}>
                      <Form.Group controlId="longitude">
                        <Form.Label className="small fw-bold text-secondary">Longitude</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.000001"
                          placeholder="e.g. 77.5946"
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group controlId="latitude">
                        <Form.Label className="small fw-bold text-secondary">Latitude</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.000001"
                          placeholder="e.g. 12.9716"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <div className="d-flex justify-content-between">
                  <Button variant="outline-secondary" onClick={() => setStep(2)}>
                    <i className="fa-solid fa-arrow-left me-1"></i> Back
                  </Button>
                  <Button variant="success" type="submit" disabled={loading || files.length === 0 || !locationName}>
                    {loading ? 'Submitting...' : 'Publish Listing 🚀'}
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateListing;
