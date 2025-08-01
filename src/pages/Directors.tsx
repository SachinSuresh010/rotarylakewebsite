import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Member {
  id: string;
  name: string;
  image: string;
  alt: string;
  currentPosition: string | null;
  pastPositions: string[];
  isPastPresident: boolean;
  presidentialYears: string[];
  link?: string;
}

interface MembersData {
  members: Member[];
}

const Directors: React.FC = () => {
  const [membersData, setMembersData] = useState<MembersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMembersData = async () => {
      try {
        const response = await fetch('/assets/data/members.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMembersData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load members data');
        console.error('Error loading members data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMembersData();
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

  if (!membersData) {
    return (
      <div style={{ paddingTop: '80px' }}>
        <Container>
          <div className="text-center">
            <div className="alert alert-warning" role="alert">
              <h4>No Data Available</h4>
              <p>No directors data found.</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Filter members who have current positions (directors and office bearers)
  const currentDirectors = membersData.members.filter(member => member.currentPosition !== null);

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
            {currentDirectors.slice(0, 3).map((member, index) => (
              <Col key={member.id || index} xs={12} md={6} lg={4} className="item features-image">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="item-wrapper"
                >
                  <div className="item-img">
                    <Link to={`/members/${member.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <img 
                        src={member.image} 
                        alt={member.alt || member.name}
                        style={{
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease-in-out'
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
                    </Link>
                  </div>
                  <div className="item-content">
                    <Link to={`/members/${member.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h5 className="item-title mbr-fonts-style display-7" style={{ cursor: 'pointer' }}>
                        <strong>{member.name}</strong>
                      </h5>
                    </Link>
                    <p className="mbr-text mbr-fonts-style mt-3 display-7">
                      {member.currentPosition}
                      {member.isPastPresident && (
                        <span 
                          style={{
                            backgroundColor: '#ffc107',
                            color: '#000',
                            fontSize: '0.7rem',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            marginLeft: '5px'
                          }}
                        >
                          Past President
                        </span>
                      )}
                    </p>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Office Bearers Section */}
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
            {currentDirectors.slice(3).map((member, index) => (
              <Col key={member.id || index} xs={12} md={6} lg={3} className="item features-image">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
                  className="item-wrapper"
                >
                  <div className="item-img">
                    <Link to={`/members/${member.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <img 
                        src={member.image} 
                        alt={member.alt || member.name}
                        style={{
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease-in-out'
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
                    </Link>
                  </div>
                  <div className="item-content">
                    <Link to={`/members/${member.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h5 className="item-title mbr-fonts-style display-7" style={{ cursor: 'pointer' }}>
                        <strong>{member.name}</strong>
                      </h5>
                    </Link>
                    <p className="mbr-text mbr-fonts-style mt-3 display-7">
                      {member.currentPosition}
                      {member.isPastPresident && (
                        <span 
                          style={{
                            backgroundColor: '#ffc107',
                            color: '#000',
                            fontSize: '0.7rem',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            marginLeft: '5px'
                          }}
                        >
                          Past President
                        </span>
                      )}
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

export default Directors;
