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

const Members: React.FC = () => {
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
      } finally {
        setLoading(false);
      }
    };

    loadMembersData();
  }, []);

  if (loading) {
    return (
      <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading members...</p>
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
              <h4>Error Loading Members</h4>
              <p>{error}</p>
              <p className="mb-0">Please try refreshing the page.</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!membersData) {
    return (
      <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container>
          <div className="text-center">
            <div className="alert alert-warning" role="alert">
              <h4>No Data Available</h4>
              <p>No members data found.</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <section className="gallery3 cid-tnWdFTpBxT" id="gallery3-1b" style={{ minHeight: '400px', padding: '40px 0' }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mbr-section-head"
          >
            <h4 className="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
              <strong>Members</strong>
            </h4>
            <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
              Found {membersData.members.length} members
            </p>
          </motion.div>
          
          <Row className="mt-4">
            {membersData.members.map((member, index) => (
              <Col key={member.id || index} xs={12} md={6} lg={3} className="item features-image">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="item-wrapper"
                  style={{
                    background: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    padding: '20px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    border: '1px solid #eee'
                  }}
                >
                  <div className="item-img" style={{ marginBottom: '15px' }}>
                    <Link to={`/members/${member.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <img 
                        src={member.image} 
                        alt={member.alt || member.name}
                        style={{
                          width: '100%',
                          maxWidth: '200px',
                          height: 'auto',
                          borderRadius: '8px',
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
                      <h5 className="item-title mbr-fonts-style display-7" style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1rem', cursor: 'pointer' }}>
                        <strong>{member.name}</strong>
                      </h5>
                    </Link>
                    {member.currentPosition && (
                      <p className="mbr-text mbr-fonts-style mt-3 display-7" style={{ color: '#666', marginBottom: '5px', fontSize: '0.9rem' }}>
                        {member.currentPosition}
                      </p>
                    )}
                    {member.isPastPresident && (
                      <p className="mbr-text mbr-fonts-style mt-2 display-7" style={{ marginBottom: '5px' }}>
                        <span 
                          style={{
                            backgroundColor: '#ffc107',
                            color: '#000',
                            fontSize: '0.7rem',
                            padding: '2px 6px',
                            borderRadius: '10px'
                          }}
                        >
                          Past President
                        </span>
                      </p>
                    )}
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

export default Members;
