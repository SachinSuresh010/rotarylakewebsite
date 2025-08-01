import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';

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
  const [servicesData, setServicesData] = useState<ServicesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    const loadServicesData = async () => {
      try {
        const response = await fetch('/assets/data/services.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setServicesData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load services data');
      } finally {
        setLoading(false);
      }
    };

    loadServicesData();
  }, []);

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
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <h3 className="mbr-fonts-style display-2">
            <strong>Our Services</strong>
          </h3>
          <h5 className="mbr-section-subtitle mbr-fonts-style align-center mb-0 mt-2 display-5">
            Rotary avenues of service
          </h5>
          <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
            {servicesData.services.length} service categories • {totalProjects} total projects
          </p>
        </motion.div>

        {/* Service Categories Overview */}
        <Row className="mb-5">
          {servicesData.services.map((service, index) => (
            <Col key={service.id} xs={12} md={6} lg={4} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className="h-100 service-card"
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    border: selectedService === service.id ? '2px solid #007bff' : '1px solid #dee2e6'
                  }}
                  onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  }}
                >
                  <Card.Body className="text-center">
                    <div className="mb-3" style={{ fontSize: '3rem' }}>
                      {service.icon}
                    </div>
                    <Card.Title className="mbr-fonts-style display-5">
                      <strong>{service.title}</strong>
                    </Card.Title>
                    <Card.Text className="mbr-text mbr-fonts-style display-7">
                      {service.description}
                    </Card.Text>
                    <Badge bg="primary" className="mt-2">
                      {service.projects.length} {service.projects.length === 1 ? 'Project' : 'Projects'}
                    </Badge>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Projects by Selected Service */}
        {selectedService && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5"
          >
            <div className="text-center mb-4">
              <h4 className="mbr-fonts-style display-4">
                <strong>
                  {servicesData.services.find(s => s.id === selectedService)?.title} Projects
                </strong>
              </h4>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSelectedService(null)}
              >
                ← Back to All Services
              </button>
            </div>
            
            <Row>
              {servicesData.services
                .find(s => s.id === selectedService)
                ?.projects.map((project, index) => (
                  <Col key={project.id} xs={12} md={6} lg={4} className="mb-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="h-100 project-card">
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
                        <Card.Body>
                          <h5 className="item-title mbr-fonts-style display-7">
                            <strong>{project.title}</strong>
                          </h5>
                          <p className="item-subtitle mbr-fonts-style mt-1 display-7" style={{ color: '#666', fontSize: '0.9rem' }}>
                            <em>{project.date}</em>
                          </p>
                          <p className="mbr-text mbr-fonts-style mt-3 display-7">
                            {project.description}
                          </p>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
            </Row>
          </motion.div>
        )}

        {/* All Projects Overview (when no service is selected) */}
        {!selectedService && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-4">
              <h4 className="mbr-fonts-style display-4">
                <strong>Recent Projects</strong>
              </h4>
              <p className="text-muted">Click on a service category above to view all projects</p>
            </div>
            
            <Row>
              {servicesData.services.flatMap(service => 
                service.projects.slice(0, 2).map(project => ({ ...project, serviceTitle: service.title }))
              ).slice(0, 6).map((project, index) => (
                <Col key={`${project.serviceTitle}-${project.id}`} xs={12} md={6} lg={4} className="mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-100 project-card">
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
                      <Card.Body>
                        <Badge bg="secondary" className="mb-2">
                          {project.serviceTitle}
                        </Badge>
                        <h5 className="item-title mbr-fonts-style display-7">
                          <strong>{project.title}</strong>
                        </h5>
                        <p className="item-subtitle mbr-fonts-style mt-1 display-7" style={{ color: '#666', fontSize: '0.9rem' }}>
                          <em>{project.date}</em>
                        </p>
                        <p className="mbr-text mbr-fonts-style mt-3 display-7">
                          {project.description}
                        </p>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        )}
      </Container>
    </div>
  );
};

export default Services;
