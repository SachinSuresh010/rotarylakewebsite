import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePageTitle } from '../hooks/usePageTitle';
import MemberImage from '../components/MemberImage';

interface Member {
  id: string;
  name: string;
  profileImage?: string;
  image?: string; // Legacy field
  alt?: string;
  positions?: {
    isCurrent: boolean;
    title?: string;
    year?: string;
  }[];
  currentDesignation?: string; // Legacy field
  isPastPresident?: boolean;
  pastPresidentYears?: string[];
  link?: string;
}

interface DirectorsData {
  directors: Member[];
}

const Directors: React.FC = () => {
  usePageTitle('Directors');
  
  const [directorsData, setDirectorsData] = useState<DirectorsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDirectorsData = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${API_BASE_URL}/members/directors/current`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDirectorsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load directors data');
        console.error('Error loading directors data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDirectorsData();
  }, []);

  if (loading) {
    return (
      <div style={{ paddingTop: '80px' }}>
        <Container>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading directors...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '80px' }}>
        <Container>
          <div className="text-center">
            <div className="alert alert-danger" role="alert">
              <h4>Error Loading Directors</h4>
              <p>{error}</p>
              <p className="mb-0">Please check the console for more details.</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!directorsData || directorsData.directors.length === 0) {
    return (
      <div style={{ paddingTop: '80px' }}>
        <Container>
          <div className="text-center">
            <div className="alert alert-warning" role="alert">
              <h4>No Directors Available</h4>
              <p>No current directors found.</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }



  // Helper function to get member position
  const getMemberPosition = (member: Member) => {
    if (member.positions && member.positions.length > 0) {
      const currentPosition = member.positions.find(pos => pos.isCurrent);
      return currentPosition?.title || 'Director';
    }
    return member.currentDesignation || 'Director';
  };

  // Separate directors into board members (President, Secretary, Treasurer) and office bearers (rest)
  const boardMembers = directorsData.directors.filter(member => {
    const position = getMemberPosition(member).toLowerCase();
    return position === 'president' || position === 'secretary' || position === 'treasurer';
  }).sort((a, b) => {
    const positionA = getMemberPosition(a).toLowerCase();
    const positionB = getMemberPosition(b).toLowerCase();
    
    // President comes first
    if (positionA === 'president') return -1;
    if (positionB === 'president') return 1;
    
    // Secretary comes second
    if (positionA === 'secretary') return -1;
    if (positionB === 'secretary') return 1;
    
    // Treasurer comes third
    if (positionA === 'treasurer') return -1;
    if (positionB === 'treasurer') return 1;
    
    return 0;
  });
  const officeBearers = directorsData.directors.filter(member => {
    const position = getMemberPosition(member).toLowerCase();
    return position !== 'president' && position !== 'secretary' && position !== 'treasurer';
  });

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Board of Directors Section */}
      <section className="features3 cid-tnW88vQiKO" id="features3-19">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mbr-section-head"
          >
            <h4 className="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
              <strong>Board of Directors</strong>
            </h4>
          </motion.div>
          
          <Row className="mt-4">
            {boardMembers.map((member, index) => (
              <Col key={member.id || index} xs={12} md={6} lg={4} className="item features-image">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="item-wrapper"
                >
                  <div className="item-img">
                    <Link to={`/members/${member.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{
                        width: '100%',
                        height: '300px',
                        overflow: 'hidden',
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {member.profileImage || member.image ? (
                          <img 
                            src={member.profileImage || member.image} 
                            alt={member.alt || member.name}
                            style={{
                              cursor: 'pointer',
                              transition: 'transform 0.2s ease-in-out',
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              objectPosition: 'center'
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const placeholder = parent.querySelector('.director-placeholder') as HTMLElement;
                                if (placeholder) {
                                  placeholder.style.display = 'flex';
                                }
                              }
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          />
                        ) : null}
                        <div 
                          className="director-placeholder"
                          style={{
                            width: '100%',
                            height: '100%',
                            display: (member.profileImage || member.image) ? 'none' : 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            border: '2px dashed #dee2e6'
                          }}
                        >
                          <span style={{ fontSize: '4rem', color: '#6c757d' }}>👤</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="item-content">
                    <Link to={`/members/${member.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h5 className="item-title mbr-fonts-style display-7" style={{ cursor: 'pointer' }}>
                        <strong>{member.name}</strong>
                      </h5>
                    </Link>
                    <p className="mbr-text mbr-fonts-style mt-3 display-7">
                      {getMemberPosition(member)}
                    </p>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Office Bearers Section */}
      {officeBearers.length > 0 && (
        <section className="gallery3 cid-tnW97qq4aO" id="gallery3-1a">
          <Container fluid>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mbr-section-head"
            >
              <h5 className="mbr-section-subtitle mbr-fonts-style align-center mb-0 mt-2 display-5">
                Office Bearers
              </h5>
            </motion.div>
            
            <Row className="mt-4">
              {officeBearers.map((member, index) => (
                <Col key={member.id || index} xs={12} md={6} lg={3} className="item features-image">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
                    className="item-wrapper"
                  >
                    <div className="item-img">
                      <Link to={`/members/${member.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{
                          width: '100%',
                          height: '300px',
                          overflow: 'hidden',
                          borderRadius: '8px',
                          backgroundColor: '#f8f9fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {member.profileImage || member.image ? (
                            <img 
                              src={member.profileImage || member.image} 
                              alt={member.alt || member.name}
                              style={{
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease-in-out',
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                objectPosition: 'center'
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  const placeholder = parent.querySelector('.director-placeholder') as HTMLElement;
                                  if (placeholder) {
                                    placeholder.style.display = 'flex';
                                  }
                                }
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            />
                          ) : null}
                          <div 
                            className="director-placeholder"
                            style={{
                              width: '100%',
                              height: '100%',
                              display: (member.profileImage || member.image) ? 'none' : 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '8px',
                              border: '2px dashed #dee2e6'
                            }}
                          >
                            <span style={{ fontSize: '4rem', color: '#6c757d' }}>👤</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="item-content">
                      <Link to={`/members/${member.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h5 className="item-title mbr-fonts-style display-7" style={{ cursor: 'pointer' }}>
                          <strong>{member.name}</strong>
                        </h5>
                      </Link>
                      <p className="mbr-text mbr-fonts-style mt-3 display-7">
                        {getMemberPosition(member)}
                      </p>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
    </div>
  );
};

export default Directors;
