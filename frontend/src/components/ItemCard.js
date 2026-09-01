import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  let badgeColor = 'secondary';
  let badgeText = '';
  let priceText = '';

  switch (item.listingType) {
    case 'DONATE':
      badgeColor = 'success';
      badgeText = 'DONATE';
      priceText = 'Free';
      break;
    case 'RENT':
      badgeColor = 'primary';
      badgeText = 'RENT';
      priceText = `$${item.pricing?.dailyRate || 0}/day`;
      break;
    case 'LEASE':
      badgeColor = 'warning text-dark';
      badgeText = 'LEASE';
      priceText = `$${item.pricing?.monthlyRate || 0}/mo`;
      break;
    default:
      badgeText = item.listingType;
  }

  const getCategoryStyles = (category) => {
    const cat = (category || '').toLowerCase();
    const isDark = document.body.classList.contains('theme-dark-cyber') || document.body.classList.contains('theme-synthwave');
    
    if (isDark) {
      if (cat.includes('elect')) {
        return {
          background: 'linear-gradient(135deg, #111827 0%, #0369a1 100%)',
          borderColor: '#0284c7',
          borderBottom: '4px solid #06b6d4'
        };
      } else if (cat.includes('book')) {
        return {
          background: 'linear-gradient(135deg, #111827 0%, #065f46 100%)',
          borderColor: '#047857',
          borderBottom: '4px solid #10b981'
        };
      } else if (cat.includes('furn')) {
        return {
          background: 'linear-gradient(135deg, #111827 0%, #78350f 100%)',
          borderColor: '#b45309',
          borderBottom: '4px solid #f97316'
        };
      } else if (cat.includes('cloth')) {
        return {
          background: 'linear-gradient(135deg, #111827 0%, #581c87 100%)',
          borderColor: '#6b21a8',
          borderBottom: '4px solid #d946ef'
        };
      } else if (cat.includes('kitchen') || cat.includes('cook')) {
        return {
          background: 'linear-gradient(135deg, #111827 0%, #7c2d12 100%)',
          borderColor: '#9a3412',
          borderBottom: '4px solid #f43f5e'
        };
      } else if (cat.includes('sport')) {
        return {
          background: 'linear-gradient(135deg, #111827 0%, #831843 100%)',
          borderColor: '#9d174d',
          borderBottom: '4px solid #e11d48'
        };
      }
      return {
        background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
        borderColor: 'var(--border-color)',
        borderBottom: '4px solid var(--border-hover)'
      };
    } else {
      if (cat.includes('elect')) {
        return {
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          borderColor: '#bae6fd',
          borderBottom: '4px solid #0284c7'
        };
      } else if (cat.includes('book')) {
        return {
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          borderColor: '#bbf7d0',
          borderBottom: '4px solid #059669'
        };
      } else if (cat.includes('furn')) {
        return {
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          borderColor: '#fde047',
          borderBottom: '4px solid #ea580c'
        };
      } else if (cat.includes('cloth')) {
        return {
          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          borderColor: '#e9d5ff',
          borderBottom: '4px solid #7c3aed'
        };
      } else if (cat.includes('kitchen') || cat.includes('cook')) {
        return {
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
          borderColor: '#fed7aa',
          borderBottom: '4px solid #e11d48'
        };
      } else if (cat.includes('sport')) {
        return {
          background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
          borderColor: '#fbcfe8',
          borderBottom: '4px solid #b91c1c'
        };
      }
      return {
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderColor: 'var(--border-color)',
        borderBottom: '4px solid var(--primary-color)'
      };
    }
  };

  const cardStyle = getCategoryStyles(item.category);

  // Safety fallback for image path
  const imageSrc = item.images && item.images.length > 0 
    ? `http://localhost:5000${item.images[0]}`
    : 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600';

  return (
    <Card 
      as={Link} 
      to={`/items/${item._id}`} 
      className="card h-100 shadow-xs item-card text-decoration-none text-dark"
      style={{ ...cardStyle }}
    >
      <div className="item-card-img-container">
        {/* Overlay listing badge */}
        <Badge bg={badgeColor} className="badge-overlay shadow-sm">
          {badgeText}
        </Badge>
        <Card.Img variant="top" src={imageSrc} alt={item.title} />
      </div>
      
      <Card.Body className="d-flex flex-column justify-content-between p-3.5">
        <div>
          <span className="text-uppercase text-muted fw-extrabold tracking-wider d-block mb-1" style={{ fontSize: '0.7rem' }}>
            {item.category}
          </span>
          <Card.Title className="fw-bold mb-2 text-truncate-2" style={{ minHeight: '44px', fontSize: '1.05rem', lineHeight: '1.3', color: 'var(--text-main)' }}>
            {item.title}
          </Card.Title>
          <Card.Text className="text-muted small mb-3 text-truncate-3" style={{ minHeight: '54px', fontSize: '0.85rem' }}>
            {item.description}
          </Card.Text>
        </div>

        <div>
          <div className="text-muted small mb-2 d-flex align-items-center" style={{ fontSize: '0.8rem' }}>
            <i className="fa-solid fa-location-dot me-1.5 text-danger"></i>
            <span className="text-truncate fw-semibold text-secondary">{item.locationName || 'Unknown Location'}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center pt-2.5" style={{ borderTop: '1px solid var(--border-color)' }}>
            <span className="text-secondary small" style={{ fontSize: '0.78rem' }}>
              By <strong style={{ color: 'var(--primary-color)' }}>{item.provider?.name || 'Member'}</strong>
            </span>
            <span className="fw-bold price-tag-badge" style={{ 
              backgroundColor: item.listingType === 'DONATE' ? '#d1fae5' : 'var(--glow-color)', 
              color: item.listingType === 'DONATE' ? '#065f46' : 'var(--primary-color)',
              padding: '4px 12px',
              borderRadius: '2rem',
              fontSize: '0.85rem'
            }}>
              {priceText}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ItemCard;
