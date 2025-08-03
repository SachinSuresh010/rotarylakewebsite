import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getEventsByYear } from '../data/eventData';

const Gallery2022: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const events = getEventsByYear("2022-2023");

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
            <strong>Gallery 2022-2023</strong>
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

        <Row>
          {events.map((event, index) => (
            <Col key={event.id} xs={12} md={6} lg={4} className="mb-4">
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
                  onClick={() => setSelectedYear(selectedYear === event.id ? null : event.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="position-relative">
                    <img
                      src={event.thumbnail}
                      alt={event.name}
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
                      {event.images.length} photos
                    </div>
                  </div>
                  
                  <Card.Body className="text-center" style={{ padding: '25px' }}>
                    <h5 className="card-title mbr-fonts-style display-5 mb-3">
                      <strong>{event.name}</strong>
                    </h5>
                    <p className="card-text mbr-fonts-style display-7" style={{ 
                      color: '#666', 
                      fontSize: '1rem',
                      lineHeight: '1.6'
                    }}>
                      {event.description}
                    </p>
                    
                    <Link 
                      to={`/gallery/2022-2023/${event.id}`}
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
          ))}
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
                {events.slice(0, 4).map((event, index) => (
                  <Col key={`preview-${event.id}`} md={6} lg={3} className="mb-4">
                    <div className="card h-100" style={{ 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      border: 'none'
                    }}>
                      <img 
                        src={event.thumbnail} 
                        alt={event.name}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover'
                        }}
                      />
                      <div className="card-body text-center">
                        <h6 className="card-title">{event.name}</h6>
                        <Link 
                          to={`/gallery/2022-2023/${event.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Gallery2022; 