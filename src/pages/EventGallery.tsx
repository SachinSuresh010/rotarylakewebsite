import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { getEventsByYear, Event } from '../data/eventData';
import { usePageTitle } from '../hooks/usePageTitle';

// Custom CSS for larger modal
const modalStyles = `
  /* Override App.css modal restrictions */
  .modal-xl {
    max-width: 98vw !important;
    width: 98vw !important;
  }
  
  .modal-xl .modal-dialog {
    max-width: 98vw !important;
    width: 98vw !important;
    margin: 1vh auto !important;
  }
  
  .modal-xl .modal-content {
    height: 98vh !important;
    max-height: 98vh !important;
    max-width: 98vw !important;
    width: 98vw !important;
  }
  
  .modal-xl .modal-body {
    height: calc(98vh - 120px) !important;
    max-height: calc(98vh - 120px) !important;
    overflow: visible !important;
  }
  
  /* Override any existing modal styles with higher specificity */
  .modal.show .modal-xl {
    max-width: 98vw !important;
    width: 98vw !important;
  }
  
  .modal.show .modal-xl .modal-dialog {
    max-width: 98vw !important;
    width: 98vw !important;
    margin: 1vh auto !important;
  }
  
  .modal.show .modal-xl .modal-content {
    height: 98vh !important;
    max-height: 98vh !important;
    max-width: 98vw !important;
    width: 98vw !important;
  }
  
  .modal.show .modal-xl .modal-body {
    height: calc(98vh - 120px) !important;
    max-height: calc(98vh - 120px) !important;
    overflow: visible !important;
  }
  
  /* Override App.css specific styles */
  .modal-xl .modal-content {
    border-radius: 15px !important;
    border: none !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
    max-width: 98vw !important;
    margin: 0 auto !important;
  }
  
  .modal-xl .modal-body {
    padding: 0 !important;
    max-height: calc(98vh - 120px) !important;
    overflow: visible !important;
  }
  
  .modal-xl .modal-dialog {
    margin: 1vh auto !important;
    max-width: 98vw !important;
  }
  
  @media (max-width: 768px) {
    .modal-xl {
      max-width: 100vw !important;
      width: 100vw !important;
    }
    
    .modal-xl .modal-dialog {
      max-width: 100vw !important;
      width: 100vw !important;
      margin: 0 !important;
    }
    
    .modal-xl .modal-content {
      height: 100vh !important;
      max-height: 100vh !important;
      max-width: 100vw !important;
      width: 100vw !important;
      border-radius: 0 !important;
    }
    
    .modal-xl .modal-body {
      height: calc(100vh - 120px) !important;
      max-height: calc(100vh - 120px) !important;
      overflow: visible !important;
    }
    
    /* Override for mobile */
    .modal.show .modal-xl {
      max-width: 100vw !important;
      width: 100vw !important;
    }
    
    .modal.show .modal-xl .modal-dialog {
      max-width: 100vw !important;
      width: 100vw !important;
      margin: 0 !important;
    }
    
    .modal.show .modal-xl .modal-content {
      height: 100vh !important;
      max-height: 100vh !important;
      max-width: 100vw !important;
      width: 100vw !important;
      border-radius: 0 !important;
    }
    
    .modal.show .modal-xl .modal-body {
      height: calc(100vh - 120px) !important;
      max-height: calc(100vh - 120px) !important;
      overflow: visible !important;
    }
  }
`;

interface DynamicEvent {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  images: {
    id: string;
    src: string;
    alt: string;
  }[];
  year: string;
  createdAt?: string;
}

interface GalleryYearResponse {
  year: string;
  isStatic: boolean;
  yearData?: any;
  events?: DynamicEvent[];
}

const EventGallery: React.FC = () => {
  const { year } = useParams<{ year: string }>();
  usePageTitle(`Gallery ${year}`);
  
  const [events, setEvents] = useState<(Event | DynamicEvent)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<(Event | DynamicEvent) | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [isStatic, setIsStatic] = useState(true);
  const [yearDescription, setYearDescription] = useState<string>('');

  // Add custom styles to document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = modalStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    const fetchGalleryData = async () => {
      if (!year) return;

      try {
        setLoading(true);
        
        // Try to fetch from API first
        const response = await fetch(`/api/gallery/${year}`);
        
        if (response.ok) {
          const data: GalleryYearResponse = await response.json();
          
          if (data.isStatic) {
            // Use static data from frontend
            const staticEvents = getEventsByYear(year);
            setEvents(staticEvents);
            setIsStatic(true);
            setYearDescription('Static gallery content');
          } else {
            // Use dynamic data from API
            setEvents(data.events || []);
            setIsStatic(false);
            // Use year description from backend if available
            setYearDescription(data.yearData?.description || 'Gallery content');
          }
        } else {
          // Fallback to static data
          const staticEvents = getEventsByYear(year);
          setEvents(staticEvents);
          setIsStatic(true);
          setYearDescription('Static gallery content');
        }
      } catch (err) {
        console.error('Error fetching gallery data:', err);
        setError('Failed to load gallery. Using static data.');
        
        // Fallback to static data
        const staticEvents = getEventsByYear(year);
        setEvents(staticEvents);
        setIsStatic(true);
        setYearDescription('Static gallery content');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, [year]);

  const handleEventClick = useCallback((event: Event | DynamicEvent) => {
    setSelectedEvent(event);
    setCurrentImageIndex(0);
    setImageLoading(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedEvent(null);
    setCurrentImageIndex(0);
    setImageLoading(false);
  }, []);

  const handlePreviousImage = useCallback(() => {
    if (selectedEvent && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setImageLoading(true);
    }
  }, [selectedEvent, currentImageIndex]);

  const handleNextImage = useCallback(() => {
    if (selectedEvent && currentImageIndex < selectedEvent.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setImageLoading(true);
    }
  }, [selectedEvent, currentImageIndex]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!selectedEvent) return;
    
    if (e.key === 'ArrowLeft') {
      handlePreviousImage();
    } else if (e.key === 'ArrowRight') {
      handleNextImage();
    } else if (e.key === 'Escape') {
      handleCloseModal();
    }
  }, [selectedEvent, handlePreviousImage, handleNextImage, handleCloseModal]);

  useEffect(() => {
    if (selectedEvent) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedEvent, handleKeyPress]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Image failed to load:', selectedEvent?.images[currentImageIndex]?.src);
    const target = e.target as HTMLImageElement;
    target.src = '/assets/images/placeholder.jpg';
    setImageLoading(false);
  };

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
          <Link 
            to="/gallery" 
            className="btn btn-outline-primary mb-3"
            style={{ borderRadius: '25px', padding: '8px 20px' }}
          >
            ← Back to Gallery
          </Link>
          <h2 className="mbr-fonts-style display-2 mb-3">
            <strong>Gallery {year}</strong>
          </h2>
          <h4 className="mbr-section-subtitle mbr-fonts-style align-center mb-0 mt-2 display-5">
            {yearDescription}
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
          </Alert>
        )}

        {events.length === 0 ? (
          <div className="text-center py-5">
            <h4>No events found for {year}</h4>
            <p className="text-muted">Check back later for updates.</p>
          </div>
        ) : (
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
                    className="h-100 gallery-event-card"
                    style={{
                      borderRadius: '15px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}
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
                      {!isStatic && (
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
                        <strong>{event.name}</strong>
                      </h5>
                      <p className="card-text mbr-fonts-style display-7" style={{ 
                        color: '#666', 
                        fontSize: '1rem',
                        lineHeight: '1.6'
                      }}>
                        {event.description}
                      </p>
                      
                      <button 
                        className="btn btn-primary"
                        style={{
                          borderRadius: '25px',
                          padding: '10px 25px',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                        onClick={() => handleEventClick(event)}
                      >
                        View Photos →
                      </button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}

        {/* Enhanced Image Modal */}
        <Modal 
          show={!!selectedEvent} 
          onHide={handleCloseModal}
          size="xl"
          centered
          style={{ zIndex: 9999 }}
          dialogClassName="modal-xl"
        >
          <Modal.Header 
            closeButton 
            style={{ 
              border: 'none', 
              padding: '20px 30px 10px',
              backgroundColor: '#f8f9fa'
            }}
          >
            <Modal.Title style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
              {selectedEvent?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body 
            className="text-center p-0" 
            style={{ 
              backgroundColor: '#000',
              position: 'relative',
              height: 'calc(98vh - 120px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {selectedEvent && selectedEvent.images.length > 0 && (
              <>
                {/* Main Image Container */}
                <div style={{ 
                  position: 'relative', 
                  flex: 1,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#000',
                  minHeight: '0'
                }}>
                  {/* Loading Spinner */}
                  {imageLoading && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 5
                    }}>
                      <Spinner animation="border" role="status" variant="light" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading image...</span>
                      </Spinner>
                    </div>
                  )}
                  
                  {/* Main Image */}
                  <img 
                    src={selectedEvent.images[currentImageIndex].src} 
                    alt={selectedEvent.images[currentImageIndex].alt || selectedEvent.name}
                    style={{ 
                      maxWidth: '98%', 
                      maxHeight: '98%',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      opacity: imageLoading ? 0 : 1,
                      transition: 'opacity 0.3s ease'
                    }}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                  
                  {/* Navigation Arrows */}
                  {currentImageIndex > 0 && (
                    <button
                      onClick={handlePreviousImage}
                      style={{
                        position: 'absolute',
                        left: '30px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        fontSize: '2rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                        e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                      }}
                    >
                      ‹
                    </button>
                  )}
                  
                  {currentImageIndex < selectedEvent.images.length - 1 && (
                    <button
                      onClick={handleNextImage}
                      style={{
                        position: 'absolute',
                        right: '30px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        fontSize: '2rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                        e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                      }}
                    >
                      ›
                    </button>
                  )}
                  
                  {/* Image Counter */}
                  <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {currentImageIndex + 1} of {selectedEvent.images.length}
                  </div>
                </div>
                
                {/* Thumbnail Navigation */}
                {selectedEvent.images.length > 1 && (
                  <div style={{
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderTop: '1px solid #dee2e6',
                    maxHeight: '120px',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      overflowX: 'auto',
                      padding: '10px 0',
                      justifyContent: 'center',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#007bff #f8f9fa'
                    }}>
                      {selectedEvent.images.map((image, index) => (
                        <div
                          key={image.id || index}
                          onClick={() => {
                            setCurrentImageIndex(index);
                            setImageLoading(true);
                          }}
                          style={{
                            width: '100px',
                            height: '75px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: index === currentImageIndex ? '3px solid #007bff' : '3px solid transparent',
                            transition: 'all 0.3s ease',
                            flexShrink: 0,
                            boxShadow: index === currentImageIndex ? '0 4px 12px rgba(0,123,255,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = index === currentImageIndex ? '0 4px 12px rgba(0,123,255,0.3)' : '0 2px 8px rgba(0,0,0,0.1)';
                          }}
                        >
                          <img
                            src={image.src}
                            alt={image.alt || `${selectedEvent.name} ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/assets/images/placeholder.jpg';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default EventGallery; 