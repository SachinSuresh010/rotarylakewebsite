import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { getEvent } from '../data/eventData';
import { usePageTitle } from '../hooks/usePageTitle';

const EventPage: React.FC = () => {
  const { year, eventId } = useParams<{ year: string; eventId: string }>();
  const navigate = useNavigate();
  
  const eventData = getEvent(year || '', eventId || '');
  usePageTitle(eventData ? eventData.name : 'Event');

  if (!year || !eventId) {
    return (
      <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container>
          <div className="text-center py-5">
            <h2>Event not found</h2>
            <Button onClick={() => navigate('/gallery')} className="mt-3">
              Back to Gallery
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const event = getEvent(year, eventId);

  if (!event) {
    return (
      <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container>
          <div className="text-center py-5">
            <h2>Event not found</h2>
            <Button onClick={() => navigate('/gallery')} className="mt-3">
              Back to Gallery
            </Button>
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
          <Button 
            onClick={() => navigate(`/gallery/${year}`)}
            variant="outline-primary"
            className="mb-3"
            style={{ borderRadius: '25px', padding: '8px 20px' }}
          >
            ← Back to Gallery
          </Button>
          <h2 className="mbr-fonts-style display-2 mb-3">
            <strong>{event.name}</strong>
          </h2>
          <h4 className="mbr-section-subtitle mbr-fonts-style align-center mb-0 mt-2 display-5">
            {event.description}
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
          {event.images.map((image, index) => (
            <Col key={image.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card 
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
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
                  />
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-4">
          <p className="text-muted">
            {event.images.length} image{event.images.length !== 1 ? 's' : ''} in this gallery
          </p>
        </div>
      </Container>
    </div>
  );
};

export default EventPage; 