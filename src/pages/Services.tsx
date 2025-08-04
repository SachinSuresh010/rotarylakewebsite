import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTitle } from '../hooks/usePageTitle';

interface Project {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  alt: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  projects: Project[];
}

interface ServicesData {
  services: Service[];
}

const Services: React.FC = () => {
  usePageTitle('Services');
  
  const [servicesData, setServicesData] = useState<ServicesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadServicesData = async () => {
      try {
        // Try to fetch from backend API first
        const response = await fetch('/api/services');
        
        if (!response.ok) {
          throw new Error(`API error! status: ${response.status}`);
        }
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API returned non-JSON response');
        }
        
        const data = await response.json();
        setServicesData(data);
      } catch (err) {
        console.error('API failed, trying static file:', err);
        
        try {
          // Fallback to static JSON file if API fails
          const fallbackResponse = await fetch('/assets/data/services.json');
          if (!fallbackResponse.ok) {
            throw new Error(`Static file error! status: ${fallbackResponse.status}`);
          }
          const data = await fallbackResponse.json();
          setServicesData(data);
        } catch (fallbackErr) {
          console.error('Both API and static file failed:', fallbackErr);
          setError('Failed to load services data. Please try refreshing the page.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadServicesData();
  }, []);

  const toggleService = (serviceId: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedServices(newExpanded);
  };

  const expandAll = () => {
    if (servicesData) {
      setExpandedServices(new Set(servicesData.services.map(s => s.id)));
    }
  };

  const collapseAll = () => {
    setExpandedServices(new Set());
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading services...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container>
          <div className="text-center">
            <div className="alert alert-danger" role="alert">
              <h4>Error Loading Services</h4>
              <p>{error}</p>
              <p className="mb-0">Please try refreshing the page.</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!servicesData) {
    return (
      <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container>
          <div className="text-center">
            <div className="alert alert-warning" role="alert">
              <h4>No Data Available</h4>
              <p>No services data found.</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const totalProjects = servicesData.services.reduce((total, service) => total + service.projects.length, 0);

  return (
    <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container className="py-5">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <h3 className="mbr-fonts-style display-2" style={{ color: '#1a365d' }}>
            <strong>Our Services</strong>
          </h3>
          <h5 className="mbr-section-subtitle mbr-fonts-style align-center mb-0 mt-2 display-5" style={{ color: '#2d5a5f' }}>
            Rotary avenues of service
          </h5>
          <p style={{ textAlign: 'center', marginTop: '10px', color: '#4a5568' }}>
            {servicesData.services.length} service categories • {totalProjects} total projects
          </p>
          
          {/* Control Buttons */}
          <div className="mt-4 mb-4">
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="me-2"
              onClick={expandAll}
              style={{ 
                borderColor: '#2d5a5f', 
                color: '#2d5a5f',
                '--bs-btn-hover-bg': '#2d5a5f',
                '--bs-btn-hover-border-color': '#2d5a5f'
              } as React.CSSProperties}
            >
              Expand All
            </Button>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={collapseAll}
              style={{ 
                borderColor: '#718096', 
                color: '#718096',
                '--bs-btn-hover-bg': '#718096',
                '--bs-btn-hover-border-color': '#718096'
              } as React.CSSProperties}
            >
              Collapse All
            </Button>
          </div>
        </motion.div>

        {/* Services Overview Cards */}
        <Row className="mb-5">
          {servicesData.services.map((service, index) => (
            <Col key={service.id} xs={12} md={6} lg={4} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className="h-100 service-overview-card"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    border: expandedServices.has(service.id) ? '2px solid #2d5a5f' : '1px solid #e2e8f0',
                    backgroundColor: expandedServices.has(service.id) ? '#f7fafc' : 'white'
                  }}
                  onClick={() => toggleService(service.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(45, 90, 95, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <Card.Body className="text-center p-4">
                    <div className="mb-3" style={{ fontSize: '3rem' }}>
                      {service.icon}
                    </div>
                    <Card.Title className="mbr-fonts-style display-5" style={{ color: '#1a365d' }}>
                      <strong>{service.title}</strong>
                    </Card.Title>
                    <Card.Text className="mbr-text mbr-fonts-style display-7 mb-3" style={{ color: '#4a5568' }}>
                      {service.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge 
                        style={{ 
                          backgroundColor: '#2d5a5f', 
                          color: 'white',
                          border: 'none'
                        }}
                      >
                        {service.projects.length} {service.projects.length === 1 ? 'Project' : 'Projects'}
                      </Badge>
                      <Badge 
                        style={{ 
                          backgroundColor: expandedServices.has(service.id) ? '#38a169' : '#718096',
                          color: 'white',
                          border: 'none'
                        }}
                      >
                        {expandedServices.has(service.id) ? 'Expanded' : 'Click to Expand'}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Projects by Service Category */}
        <AnimatePresence>
          {servicesData.services.map((service) => (
            expandedServices.has(service.id) && (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-5"
              >
                <Card style={{ borderColor: '#2d5a5f' }}>
                  <Card.Header 
                    style={{ 
                      backgroundColor: '#2d5a5f',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleService(service.id)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>{service.icon}</span>
                        <h4 className="mb-0">{service.title} Projects</h4>
                      </div>
                      <Button 
                        variant="outline-light" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleService(service.id);
                        }}
                        style={{
                          borderColor: 'rgba(255,255,255,0.5)',
                          color: 'white'
                        }}
                      >
                        Collapse
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row>
                      {service.projects.map((project, index) => (
                        <Col key={project.id} xs={12} md={6} lg={4} className="mb-4">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                          >
                            <Card className="h-100 project-card" style={{ borderColor: '#e2e8f0' }}>
                              <div className="item-img">
                                <img 
                                  src={project.image} 
                                  alt={project.alt}
                                  style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderTopLeftRadius: 'calc(0.375rem - 1px)',
                                    borderTopRightRadius: 'calc(0.375rem - 1px)'
                                  }}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/assets/images/placeholder.jpg';
                                  }}
                                />
                              </div>
                              <Card.Body className="p-3">
                                <h6 className="item-title mbr-fonts-style display-7 mb-2" style={{ color: '#1a365d' }}>
                                  <strong>{project.title}</strong>
                                </h6>
                                <p className="item-subtitle mbr-fonts-style mb-2" style={{ color: '#718096', fontSize: '0.85rem' }}>
                                  <em>{project.date}</em>
                                </p>
                                <p className="mbr-text mbr-fonts-style mb-0 display-7" style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                                  {project.description}
                                </p>
                              </Card.Body>
                            </Card>
                          </motion.div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Summary Section */}
        {expandedServices.size === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-5"
          >
            <Card className="border-0" style={{ backgroundColor: '#f7fafc' }}>
              <Card.Body className="p-5">
                <h5 className="mb-3" style={{ color: '#2d5a5f' }}>👆 Click on any service category above to view its projects</h5>
                <p style={{ color: '#4a5568', marginBottom: 0 }}>
                  Each category contains detailed information about our projects and initiatives in that area of service.
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        )}
      </Container>
    </div>
  );
};

export default Services;
