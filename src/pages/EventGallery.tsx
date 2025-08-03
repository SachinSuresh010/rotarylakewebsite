import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface EventImage {
  id: string;
  src: string;
  alt: string;
}

interface EventGalleryProps {
  eventName: string;
  eventDescription: string;
  images: EventImage[];
  backLink: string;
}

const EventGallery: React.FC<EventGalleryProps> = ({ 
  eventName, 
  eventDescription, 
  images, 
  backLink 
}) => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };

  const handleClose = useCallback(() => {
    setShowLightbox(false);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!showLightbox) return;
    
    switch (e.key) {
      case 'Escape':
        handleClose();
        break;
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
    }
  }, [showLightbox, handleClose, handlePrevious, handleNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, handleKeyDown]);

  return (
    <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Back Button */}
      <div style={{ position: 'fixed', top: '100px', left: '20px', zIndex: 1000 }}>
        <Button
          variant="dark"
          onClick={() => navigate(backLink)}
          style={{
            borderRadius: '25px',
            padding: '10px 20px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: 'none',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          }}
        >
          ← Back to Gallery
        </Button>
      </div>

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <h2 className="mbr-fonts-style display-2 mb-3">
            <strong>{eventName}</strong>
          </h2>
          <h4 className="mbr-section-subtitle mbr-fonts-style align-center mb-0 mt-2 display-5">
            {eventDescription}
          </h4>
          <div className="mt-4" style={{ 
            width: '60px', 
            height: '3px', 
            backgroundColor: '#007bff', 
            margin: '0 auto',
            borderRadius: '2px'
          }}></div>
        </motion.div>

        {/* Gallery Grid */}
        <Row>
          {images.map((image, index) => (
            <Col key={image.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                style={{ cursor: 'pointer' }}
                onClick={() => handleImageClick(index)}
              >
                <div
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'white'
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
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Image Counter */}
        <div className="text-center mt-4">
          <p className="text-muted">
            {images.length} image{images.length !== 1 ? 's' : ''} in this gallery
          </p>
        </div>
      </Container>

      {/* Lightbox Modal */}
      <Modal
        show={showLightbox}
        onHide={handleClose}
        size="xl"
        centered
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
        contentClassName="bg-transparent border-0"
      >
        <Modal.Body className="p-0 position-relative">
          <div style={{ position: 'relative', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Close Button */}
            <Button
              variant="light"
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 1001,
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                padding: 0,
                fontSize: '20px',
                fontWeight: 'bold'
              }}
            >
              ×
            </Button>

            {/* Previous Button */}
            <Button
              variant="light"
              onClick={handlePrevious}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1001,
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                padding: 0,
                fontSize: '18px'
              }}
            >
              ‹
            </Button>

            {/* Next Button */}
            <Button
              variant="light"
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1001,
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                padding: 0,
                fontSize: '18px'
              }}
            >
              ›
            </Button>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]?.src}
                alt={images[currentImageIndex]?.alt}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
            </AnimatePresence>

            {/* Image Counter */}
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px'
              }}
            >
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EventGallery; 