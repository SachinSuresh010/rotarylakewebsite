import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

interface Member {
  id: string;
  name: string;
  email: string;
  classification?: string;
  status?: string;
  isAdmin?: boolean;
  createdAt?: Date;
  lastLogin?: Date;
  joinDate?: string;
  memberSince?: string;
  profileImage?: string;
  currentDesignation?: string;
  profession?: string;
  birthday?: string;
  hobbies?: string;
  familyMembers?: any[];
  personalBio?: string;
  personalDetails?: {
    address?: string;
    phone?: string;
    education?: string;
    achievements?: string;
    interests?: string;
    socialMedia?: {
      linkedin?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  // Legacy fields for backward compatibility
  image?: string;
  alt?: string;
  pastPositions?: string[];
  isPastPresident?: boolean;
  presidentialYears?: string[];
  link?: string;
}

const About: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Load members data from API
  useEffect(() => {
    const loadMembersData = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${API_BASE_URL}/members?sortBy=joinDate&sortOrder=asc`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMembers(data.members || []);
      } catch (err) {
        console.error('Error loading members data:', err);
        console.error('Failed to load members data:', err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadMembersData();
  }, []);

  // Get current president
  const currentPresident = members.find(member => 
    member.currentDesignation === 'President'
  );

  // Get current year
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const yearRange = `${currentYear}-${nextYear.toString().slice(-2)}`;

  // Calculate president number (assuming 2019 was the first year)
  const getPresidentNumber = () => {
    const startYear = 2019;
    const yearsSinceStart = currentYear - startYear;
    return yearsSinceStart + 1; // +1 because 2019 was the first year
  };

  const presidentNumber = getPresidentNumber();

  // Helper to get ordinal suffix (st, nd, rd, th)
  const getOrdinalSuffix = (num: number) => {
    if (num > 3 && num < 21) return 'th';
    switch (num % 10) {
      case 1:  return 'st';
      case 2:  return 'nd';
      case 3:  return 'rd';
      default: return 'th';
    }
  };

  return (
    <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
          style={{ padding: '40px 0 20px 0' }}
        >
          <h2 className="mbr-fonts-style display-2 mb-3">
            <strong>About Us</strong>
          </h2>
          <h4 className="mbr-section-subtitle mbr-fonts-style align-center mb-0 mt-2 display-5">
            Rotary Club of Cochin Lakeside
          </h4>
          <div className="mt-4" style={{ 
            width: '60px', 
            height: '3px', 
            backgroundColor: '#007bff', 
            margin: '0 auto',
            borderRadius: '2px'
          }}></div>
        </motion.div>
        
        <Row className="align-items-center mb-5">
          <Col lg={6} className="mb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="image-wrapper">
                <img 
                  src="/assets/images/img-5325-1900x1267.jpeg" 
                  alt="Rotary Club of Cochin Lakeside"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '15px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/images/placeholder.jpg';
                  }}
                />
              </div>
            </motion.div>
          </Col>
          
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-wrapper">
                <div className="mbr-text mbr-fonts-style mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  <p className="mb-4">
                    Rotary Club of Cochin Lakeside was chartered on <strong>26th June 2019</strong> under the presidency of <strong>Rtn. George Palathingal</strong>. 
                    Rotary Club of Cochin Midtown is the mother club with <strong>Rtn. PDG Babu Joseph</strong> as the GSR. 
                    Our club ID is <strong>90322</strong> and we are part of <strong>Rotary International District 3201</strong>.
                  </p>
                  <p className="mb-0">
                    {loading ? (
                      <span>Loading current president information...</span>
                    ) : currentPresident ? (
                      <><strong>Rtn. {currentPresident.name.replace('Rtn ', '')}</strong> is our {presidentNumber}{getOrdinalSuffix(presidentNumber)} President ({yearRange}). We meet at <strong>Hotel Hill Palace, Irumpanam</strong> on Thursdays. </>
                    ) : (
                      <>We meet at <strong>Hotel Hill Palace, Irumpanam</strong> on Thursdays. </>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>

        {/* Club Information Cards */}
        <Row className="mt-5">
          <Col lg={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="text-center mb-4">
                <h4 className="mbr-fonts-style display-4 mb-3">
                  <strong>Club Information</strong>
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
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    padding: '25px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: 'none',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#007bff', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 15px auto'
                    }}>
                      <span style={{ color: 'white', fontSize: '1.2rem' }}>📅</span>
                    </div>
                    <h6 className="mbr-fonts-style" style={{ 
                      color: '#007bff', 
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      marginBottom: '8px'
                    }}>
                      Charter Date
                    </h6>
                    <p className="mbr-text mbr-fonts-style" style={{ fontSize: '0.95rem', marginBottom: '0', color: '#666' }}>
                      26th June 2019
                    </p>
                  </div>
                </Col>
                
                <Col md={6} lg={3} className="mb-4">
                  <div className="card h-100" style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    padding: '25px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: 'none',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#007bff', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 15px auto'
                    }}>
                      <span style={{ color: 'white', fontSize: '1.2rem' }}>🆔</span>
                    </div>
                    <h6 className="mbr-fonts-style" style={{ 
                      color: '#007bff', 
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      marginBottom: '8px'
                    }}>
                      Club ID
                    </h6>
                    <p className="mbr-text mbr-fonts-style" style={{ fontSize: '0.95rem', marginBottom: '0', color: '#666' }}>
                      90322
                    </p>
                  </div>
                </Col>
                
                <Col md={6} lg={3} className="mb-4">
                  <div className="card h-100" style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    padding: '25px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: 'none',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#007bff', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 15px auto'
                    }}>
                      <span style={{ color: 'white', fontSize: '1.2rem' }}>👑</span>
                    </div>
                    <h6 className="mbr-fonts-style" style={{ 
                      color: '#007bff', 
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      marginBottom: '8px'
                    }}>
                      Current President
                    </h6>
                    <p className="mbr-text mbr-fonts-style" style={{ fontSize: '0.95rem', marginBottom: '0', color: '#666' }}>
                      {loading ? (
                        'Loading...'
                      ) : currentPresident ? (
                        `Rtn. ${currentPresident.name.replace('Rtn ', '')} (${yearRange})`
                      ) : (
                        'Not available'
                      )}
                    </p>
                  </div>
                </Col>
                
                <Col md={6} lg={3} className="mb-4">
                  <div className="card h-100" style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    padding: '25px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: 'none',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#007bff', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 15px auto'
                    }}>
                      <span style={{ color: 'white', fontSize: '1.2rem' }}>🏢</span>
                    </div>
                    <h6 className="mbr-fonts-style" style={{ 
                      color: '#007bff', 
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      marginBottom: '8px'
                    }}>
                      Meeting Venue
                    </h6>
                    <p className="mbr-text mbr-fonts-style" style={{ fontSize: '0.95rem', marginBottom: '0', color: '#666' }}>
                      Hotel Hill Palace, Irumpanam
                    </p>
                  </div>
                </Col>
              </Row>
            </motion.div>
          </Col>
        </Row>

        {/* Mission Statement */}
        <Row className="mt-5">
          <Col lg={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="card" style={{ 
                backgroundColor: 'white', 
                borderRadius: '15px', 
                padding: '40px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                border: 'none',
                textAlign: 'center'
              }}>
                <h4 className="mbr-fonts-style display-4 mb-4">
                  <strong>Our Mission</strong>
                </h4>
                <div style={{ 
                  width: '60px', 
                  height: '3px', 
                  backgroundColor: '#007bff', 
                  margin: '0 auto 25px auto',
                  borderRadius: '2px'
                }}></div>
                <p className="mbr-text mbr-fonts-style" style={{ 
                  maxWidth: '800px', 
                  margin: '0 auto',
                  lineHeight: '1.8',
                  fontSize: '1.1rem',
                  color: '#555'
                }}>
                  Through our various avenues of service - Community Service, Vocational Service, 
                  International Service, Youth Service, and Club Service - we work to make a positive 
                  impact in our local community and beyond. We welcome new members who share our 
                  commitment to service above self.
                </p>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
