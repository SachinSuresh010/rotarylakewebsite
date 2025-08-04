import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

interface GalleryYear {
  id: string;
  year: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  link: string;
  isStatic?: boolean;
}

interface GalleryResponse {
  years: GalleryYear[];
  total: number;
}

const Gallery: React.FC = () => {
  usePageTitle('Gallery');
  
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [galleryYears, setGalleryYears] = useState<GalleryYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleryYears = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${API_BASE_URL}/gallery`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery data');
        }
        
        const data: GalleryResponse = await response.json();
        console.log('Gallery API response:', data);
        
        // Ensure we have a valid array of years
        if (data && Array.isArray(data.years)) {
          setGalleryYears(data.years);
        } else {
          console.warn('Invalid gallery data structure:', data);
          setGalleryYears([]);
        }
      } catch (err) {
        console.error('Error fetching gallery years:', err);
        setError('Failed to load gallery. Please try again later.');
        
        // Fallback to static data if API fails
        setGalleryYears([
          {
            id: "2024-2025",
            year: "2024-2025",
            title: "2024-2025",
            description: "Current year activities and events",
            image: "/assets/images/29cce85f-3867-4dff-b9d0-00549b5eef17-1-1280x853.jpg",
            alt: "2024-2025 Gallery",
            link: "/gallery/2024-2025",
            isStatic: true
          },
          {
            id: "2023-2024",
            year: "2023-2024",
            title: "2023-2024",
            description: "A walk through our journey this year",
            image: "/assets/images/whatsapp-image-2023-06-25-at-12.53.19-pm-816x614.jpg",
            alt: "2023-2024 Gallery",
            link: "/gallery/2023-2024",
            isStatic: true
          },
          {
            id: "2022-2023",
            year: "2022-2023",
            title: "2022-2023",
            description: "A Collection of our memories",
            image: "/assets/images/img-5252-816x544.jpeg",
            alt: "2022-2023 Gallery",
            link: "/gallery/2022-2023",
            isStatic: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryYears();
  }, []);

  if (loading) {
    return (
      <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container>
          <div className="text-center py-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading gallery...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <h2 className="mbr-fonts-style display-2 mb-3">
            <strong>Gallery</strong>
          </h2>
          <h4 className="mbr-section-subtitle mbr-fonts-style align-center mb-0 mt-2 display-5">
            A Collection of our memories
          </h4>
          <div className="mt-4" style={{ 
            width: '60px', 
            height: '3px', 
            backgroundColor: '#007bff', 
            margin: '0 auto',
            borderRadius: '2px'
          }}></div>
        </motion.div>

        {error && (
          <Alert variant="warning" className="mb-4">
            <Alert.Heading>Notice</Alert.Heading>
            <p>{error}</p>
            <p className="mb-0">Showing static gallery data.</p>
          </Alert>
        )}

        <Row>
          {galleryYears && galleryYears.length > 0 ? galleryYears.map((year, index) => (
            <Col key={year.id} xs={12} md={6} lg={4} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card 
                  className="h-100 gallery-year-card"
                  style={{
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedYear(selectedYear === year.id ? null : year.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="position-relative">
                    <img
                      src={year.image}
                      alt={year.alt}
                      style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/assets/images/placeholder.jpg';
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      backgroundColor: 'rgba(0, 123, 255, 0.9)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {year.year}
                    </div>
                    {!year.isStatic && (
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        left: '15px',
                        backgroundColor: 'rgba(40, 167, 69, 0.9)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
                        NEW
                      </div>
                    )}
                  </div>
                  
                  <Card.Body className="text-center" style={{ padding: '25px' }}>
                    <h5 className="card-title mbr-fonts-style display-5 mb-3">
                      <strong>{year.title}</strong>
                    </h5>
                    <p className="card-text mbr-fonts-style display-7" style={{ 
                      color: '#666', 
                      fontSize: '1rem',
                      lineHeight: '1.6'
                    }}>
                      {year.description}
                    </p>
                    
                    <Link 
                      to={year.link}
                      className="btn btn-primary"
                      style={{
                        borderRadius: '25px',
                        padding: '10px 25px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        textDecoration: 'none'
                      }}
                    >
                      View Gallery →
                    </Link>
                  </Card.Body>
                              </Card>
            </motion.div>
          </Col>
        )) : (
          <Col xs={12} className="text-center py-5">
            <h4>No gallery years available</h4>
            <p className="text-muted">Please check back later.</p>
          </Col>
        )}
        </Row>

        {/* Quick Preview Section */}
        <Row className="mt-5">
          <Col lg={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center mb-4">
                <h4 className="mbr-fonts-style display-4 mb-3">
                  <strong>Recent Highlights</strong>
                </h4>
                <div style={{ 
                  width: '40px', 
                  height: '2px', 
                  backgroundColor: '#007bff', 
                  margin: '0 auto',
                  borderRadius: '1px'
                }}></div>
              </div>
              
              <Row>
                <Col md={6} lg={3} className="mb-4">
                  <div className="card h-100" style={{ 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: 'none'
                  }}>
                    <img 
                      src="/assets/images/29cce85f-3867-4dff-b9d0-00549b5eef17-1280x853.jpg" 
                      alt="Installation Ceremony"
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover'
                      }}
                    />
                    <div className="card-body text-center" style={{ padding: '20px' }}>
                      <h6 className="card-title" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                        Installation Ceremony
                      </h6>
                      <p className="card-text" style={{ fontSize: '0.9rem', color: '#666' }}>
                        2024-2025
                      </p>
                    </div>
                  </div>
                </Col>
                
                <Col md={6} lg={3} className="mb-4">
                  <div className="card h-100" style={{ 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: 'none'
                  }}>
                    <img 
                      src="/assets/images/whatsapp-image-2023-06-25-at-12.53.19-pm-1256x945.jpg" 
                      alt="Club Meetings"
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover'
                      }}
                    />
                    <div className="card-body text-center" style={{ padding: '20px' }}>
                      <h6 className="card-title" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                        Club Meetings
                      </h6>
                      <p className="card-text" style={{ fontSize: '0.9rem', color: '#666' }}>
                        2023-2024
                      </p>
                    </div>
                  </div>
                </Col>
                
                <Col md={6} lg={3} className="mb-4">
                  <div className="card h-100" style={{ 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: 'none'
                  }}>
                    <img 
                      src="/assets/images/0eb433d2-d2f3-4a45-b0b4-337ab117a7ed-816x612.jpeg" 
                      alt="Onam Celebration"
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover'
                      }}
                    />
                    <div className="card-body text-center" style={{ padding: '20px' }}>
                      <h6 className="card-title" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                        Onam Celebration
                      </h6>
                      <p className="card-text" style={{ fontSize: '0.9rem', color: '#666' }}>
                        2022-2023
                      </p>
                    </div>
                  </div>
                </Col>
                
                <Col md={6} lg={3} className="mb-4">
                  <div className="card h-100" style={{ 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: 'none'
                  }}>
                    <img 
                      src="/assets/images/3417d14c-f989-4d22-bcb1-c24acdeb8c7b-1600x721.jpg" 
                      alt="Christmas Celebrations"
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover'
                      }}
                    />
                    <div className="card-body text-center" style={{ padding: '20px' }}>
                      <h6 className="card-title" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                        Christmas Celebrations
                      </h6>
                      <p className="card-text" style={{ fontSize: '0.9rem', color: '#666' }}>
                        2022-2023
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Gallery;
