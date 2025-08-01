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

const PastPresidents: React.FC = () => {
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
        setError(err instanceof Error ? err.message : 'Failed to load past presidents data');
        console.error('Error loading past presidents data:', err);
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

  if (!membersData) {
    return (
      <div style={{ paddingTop: '80px' }}>
        <Container>
          <div className="text-center">
            <div className="alert alert-warning" role="alert">
              <h4>No Past Presidents Data</h4>
              <p>No past presidents data found.</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Filter members who are past presidents
  const pastPresidents = membersData.members.filter(member => member.isPastPresident);

  if (pastPresidents.length === 0) {
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
            {pastPresidents.map((president, index) => (
              <Col key={president.id || index} xs={12} md={6} lg={4} className="item features-image">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="item-wrapper"
                >
                  <div className="item-img">
                    <Link to={`/members/${president.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <img 
                        src={president.image} 
                        alt={president.alt || president.name}
                        style={{
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease-in-out'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;">👑</div>';
                          }
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
                    <Link to={`/members/${president.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h5 className="item-title mbr-fonts-style display-7" style={{ cursor: 'pointer' }}>
                        <strong>{president.name}</strong>
                      </h5>
                    </Link>
                    <p className="mbr-text mbr-fonts-style mt-3 display-7">
                      {president.presidentialYears.join(', ')}
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
