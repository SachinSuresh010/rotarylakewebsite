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
  isPastPresident?: boolean;
  pastPresidentYears?: string[];
  presidentialYears?: string[]; // Legacy field
  link?: string;
  isClickable?: boolean; // New field to indicate if member can be clicked
  isActive?: boolean; // Add this field
}

interface PresidentsData {
  presidents: Member[];
}

const PastPresidents: React.FC = () => {
  usePageTitle('Past Presidents');
  
  const [presidentsData, setPresidentsData] = useState<PresidentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPresidentsData = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${API_BASE_URL}/members/presidents/past`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setPresidentsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load past presidents data');
        console.error('Error loading past presidents data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPresidentsData();
  }, []);

  if (loading) {
    return (
      <div style={{ paddingTop: '80px' }}>
        <Container>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading past presidents...</p>
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
              <h4>Error Loading Past Presidents</h4>
              <p>{error}</p>
              <p className="mb-0">Please check the console for more details.</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!presidentsData || presidentsData.presidents.length === 0) {
    return (
      <div style={{ paddingTop: '80px' }}>
        <Container>
          <div className="text-center">
            <div className="alert alert-warning" role="alert">
              <h4>No Past Presidents</h4>
              <p>No past presidents found.</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }



  // Helper function to get presidential years
  const getPresidentialYears = (member: Member) => {
    return member.pastPresidentYears?.join(', ') || 
           member.presidentialYears?.join(', ') || 
           'Past President';
  };

  // Helper function to get the latest year from presidential years
  const getLatestYear = (member: Member) => {
    const years = member.pastPresidentYears || member.presidentialYears || [];
    if (years.length === 0) return 0;
    
    // Extract the latest year from the presidential years
    let latestYear = 0;
    years.forEach(yearStr => {
      // Handle different formats: "2020", "2020-2021", "2020-2021, 2022-2023"
      const yearParts = yearStr.split(',').map(part => part.trim());
      yearParts.forEach(part => {
        if (part.includes('-')) {
          // Range format: "2020-2021"
          const rangeParts = part.split('-');
          const endYear = parseInt(rangeParts[1]);
          if (!isNaN(endYear) && endYear > latestYear) {
            latestYear = endYear;
          }
        } else {
          // Single year format: "2020"
          const year = parseInt(part);
          if (!isNaN(year) && year > latestYear) {
            latestYear = year;
          }
        }
      });
    });
    return latestYear;
  };

  // Sort presidents by latest year (descending order)
  const sortedPresidents = presidentsData.presidents.sort((a, b) => {
    const yearA = getLatestYear(a);
    const yearB = getLatestYear(b);
    return yearB - yearA; // Descending order (latest first)
  });

  

  return (
    <div style={{ paddingTop: '80px' }}>
      <section className="features3 cid-tnW7fjvQGA" id="features3-18">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mbr-section-head"
          >
            <h4 className="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
              <strong>Past Presidents</strong>
            </h4>
          </motion.div>
          
          <Row className="mt-4">
            {sortedPresidents.map((president, index) => (
              <Col key={president.id || index} xs={12} md={6} lg={4} className="item features-image">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="item-wrapper"
                >
                  <div className="item-img">
                    {president.isClickable !== false ? (
                      <Link to={`/members/${president.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                          {president.profileImage || president.image ? (
                            <img 
                              src={president.profileImage || president.image} 
                              alt={president.alt || president.name}
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
                                  const placeholder = parent.querySelector('.president-placeholder') as HTMLElement;
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
                            className="president-placeholder"
                            style={{
                              width: '100%',
                              height: '100%',
                              display: (president.profileImage || president.image) ? 'none' : 'flex',
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
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '300px',
                        overflow: 'hidden',
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        {president.profileImage || president.image ? (
                          <img 
                            src={president.profileImage || president.image} 
                            alt={president.alt || president.name}
                            style={{
                              cursor: 'default',
                              transition: 'transform 0.2s ease-in-out',
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              objectPosition: 'center',
                              opacity: 0.7
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const placeholder = parent.querySelector('.president-placeholder') as HTMLElement;
                                if (placeholder) {
                                  placeholder.style.display = 'flex';
                                }
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className="president-placeholder"
                          style={{
                            width: '100%',
                            height: '100%',
                            display: (president.profileImage || president.image) ? 'none' : 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            border: '2px dashed #dee2e6',
                            opacity: 0.7
                          }}
                        >
                          <span style={{ fontSize: '4rem', color: '#6c757d' }}>👤</span>
                        </div>

                      </div>
                    )}
                  </div>
                  <div className="item-content">
                    {president.isClickable !== false ? (
                      <Link to={`/members/${president.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h5 className="item-title mbr-fonts-style display-7" style={{ cursor: 'pointer' }}>
                          <strong>{president.name}</strong>
                        </h5>
                      </Link>
                    ) : (
                      <h5 className="item-title mbr-fonts-style display-7" style={{ cursor: 'default', opacity: 0.8 }}>
                        <strong>{president.name}</strong>
                      </h5>
                    )}
                    <p className="mbr-text mbr-fonts-style mt-3 display-7">
                      {getPresidentialYears(president)}

                    </p>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default PastPresidents;
