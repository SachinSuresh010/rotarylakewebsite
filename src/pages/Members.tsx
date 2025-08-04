import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePageTitle } from '../hooks/usePageTitle';
import MemberImage from '../components/MemberImage';

interface Member {
  id: string;
  name: string;
  email: string;
  classification?: string;
  status?: string;
  isAdmin?: boolean;
  createdAt?: Date;
  lastLogin?: Date;
  joinDate?: string; // Add join date field
  memberSince?: string; // Add member since field
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

const Members: React.FC = () => {
  usePageTitle('Members');
  
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (!members || members.length === 0) {
    return (
      <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container>
          <div className="text-center">
            <div className="alert alert-warning" role="alert">
              <h4>No Members Found</h4>
              <p>No members data available at the moment.</p>
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
            className="mbr-section-head text-center"
          >
            <h4 className="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
              <strong>Members</strong>
            </h4>
            <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
              Found {members.length} members
            </p>
          </motion.div>
          
          <Row className="mt-4 justify-content-center">
            {members.map((member, index) => (
              <Col key={member.id || index} xs={12} sm={6} md={4} lg={3} className="item features-image mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="item-wrapper h-100"
                  style={{
                    background: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    padding: '20px',
                    textAlign: 'center',
                    border: 'none',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div className="item-img d-flex justify-content-center" style={{ marginBottom: '15px' }}>
                    <Link to={`/members/${member.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <MemberImage 
                        member={member}
                        size="medium"
                        onClick={() => {}}
                      />
                    </Link>
                  </div>
                  <div className="item-content flex-grow-1 d-flex flex-column justify-content-center">
                    <Link to={`/members/${member.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h5 className="item-title mbr-fonts-style display-7" style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1rem', cursor: 'pointer', color: '#0066CC' }}>
                        <strong>{member.name}</strong>
                      </h5>
                    </Link>
                    {member.currentDesignation && (
                      <p className="mbr-text mbr-fonts-style mt-2 display-7" style={{ color: '#666', marginBottom: '8px', fontSize: '0.9rem' }}>
                        {member.currentDesignation}
                      </p>
                    )}
                    {member.profession && (
                      <p className="mbr-text mbr-fonts-style mt-1 display-7" style={{ color: '#28a745', marginBottom: '5px', fontSize: '0.8rem' }}>
                        {member.profession}
                      </p>
                    )}
                    {member.isPastPresident && (
                      <p className="mbr-text mbr-fonts-style mt-2 display-7" style={{ marginBottom: '0' }}>
                        <span 
                          style={{
                            backgroundColor: '#ffc107',
                            color: '#000',
                            fontSize: '0.7rem',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontWeight: 'bold'
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
