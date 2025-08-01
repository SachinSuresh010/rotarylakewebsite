import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
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
  profession?: string;
  hobbies?: string;
  birthday?: string;
  bio?: string;
  family?: FamilyMember[];
}

interface FamilyMember {
  name: string;
  relation: string;
  image: string;
  alt: string;
}

interface MembersData {
  members: Member[];
}

const MemberDetail: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMemberData = async () => {
      try {
        const response = await fetch('/assets/data/members.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: MembersData = await response.json();
        const foundMember = data.members.find(m => m.id === memberId);
        
        if (!foundMember) {
          throw new Error('Member not found');
        }
        
        setMember(foundMember);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load member data');
      } finally {
        setLoading(false);
      }
    };

    if (memberId) {
      loadMemberData();
    }
  }, [memberId]);

  if (loading) {
    return (
      <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading member details...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container>
          <div className="text-center">
            <div className="alert alert-danger" role="alert">
              <h4>Error Loading Member</h4>
              <p>{error || 'Member not found'}</p>
              <p className="mb-0">Please try refreshing the page.</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Member Profile Section */}
      <section className="image2 cid-ullyClCEH4" id="image2-21" style={{ padding: '40px 0' }}>
        <Container>
          <Row className="align-items-center">
            <Col xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="image-wrapper"
                style={{ textAlign: 'center' }}
              >
                <img 
                  src={member.image} 
                  alt={member.alt || member.name}
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    height: 'auto',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/images/placeholder.jpg';
                  }}
                />
              </motion.div>
            </Col>
            <Col xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-wrapper"
                style={{ textAlign: 'left' }}
              >
                <h3 className="mbr-section-title mbr-fonts-style mb-3 display-5">
                  <strong>{member.name}</strong>
                </h3>
                {member.currentPosition && (
                  <p className="mbr-text mbr-fonts-style display-7" style={{ color: '#666', marginBottom: '15px' }}>
                    <strong>{member.currentPosition}</strong>
                  </p>
                )}
                {member.isPastPresident && (
                  <p className="mbr-text mbr-fonts-style display-7" style={{ marginBottom: '15px' }}>
                    <span 
                      style={{
                        backgroundColor: '#ffc107',
                        color: '#000',
                        fontSize: '0.8rem',
                        padding: '4px 8px',
                        borderRadius: '12px'
                      }}
                    >
                      Past President
                    </span>
                  </p>
                )}
                {member.bio && (
                  <div className="mbr-text mbr-fonts-style display-7" style={{ lineHeight: '1.6' }}>
                    {member.bio.split('\n').map((paragraph, index) => (
                      <React.Fragment key={index}>
                        {paragraph}
                        {index < member.bio!.split('\n').length - 1 && (
                          <>
                            <br />
                            <br />
                          </>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Member Details Section */}
      {(member.profession || member.hobbies || member.birthday) && (
        <section className="features15 cid-ulmn85cCxc" id="features15-22" style={{ padding: '40px 0', backgroundColor: 'white' }}>
          <Container>
            <Row className="justify-content-center">
              {member.profession && (
                <Col xs={12} md={4} className="mb-5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="item features-without-image"
                    style={{
                      textAlign: 'center',
                      padding: '20px'
                    }}
                  >
                    <div className="item-wrapper">
                      <span className="mbr-iconfont m-auto mobi-mbri-briefcase mobi-mbri" style={{ fontSize: '3rem', color: '#007bff', marginBottom: '15px', display: 'block' }}></span>
                      <div className="card-box">
                        <h4 className="card-title mbr-fonts-style mb-2 display-7">
                          <strong>Profession</strong>
                        </h4>
                        <h5 className="card-text mbr-fonts-style display-4">{member.profession}</h5>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              )}
              
              {member.hobbies && (
                <Col xs={12} md={4} className="mb-5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="item features-without-image"
                    style={{
                      textAlign: 'center',
                      padding: '20px'
                    }}
                  >
                    <div className="item-wrapper">
                      <span className="mbr-iconfont m-auto mobi-mbri-website-theme-2 mobi-mbri" style={{ fontSize: '3rem', color: '#28a745', marginBottom: '15px', display: 'block' }}></span>
                      <div className="card-box">
                        <h4 className="card-title mbr-fonts-style mb-2 display-7">
                          <strong>Hobbies</strong>
                        </h4>
                        <h5 className="card-text mbr-fonts-style display-4">{member.hobbies}</h5>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              )}
              
              {member.birthday && (
                <Col xs={12} md={4} className="mb-5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="item features-without-image"
                    style={{
                      textAlign: 'center',
                      padding: '20px'
                    }}
                  >
                    <div className="item-wrapper">
                      <span className="mbr-iconfont m-auto mobi-mbri-bootstrap mobi-mbri" style={{ fontSize: '3rem', color: '#dc3545', marginBottom: '15px', display: 'block' }}></span>
                      <div className="card-box">
                        <h4 className="card-title mbr-fonts-style mb-2 display-7">
                          <strong>Birthday</strong>
                        </h4>
                        <h5 className="card-text mbr-fonts-style display-4">{member.birthday}</h5>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              )}
            </Row>
          </Container>
        </section>
      )}

      {/* Family Section */}
      {member.family && member.family.length > 0 && (
        <section className="team1 cid-ulmon5uel6" id="team1-23" style={{ padding: '40px 0' }}>
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-5"
            >
              <h3 className="mbr-section-title mbr-fonts-style align-center mb-4 display-2">
                <strong>Family</strong>
              </h3>
            </motion.div>
            
            <Row className="justify-content-center">
              {member.family.map((familyMember, index) => (
                <Col key={index} xs={12} md={3} className="mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="item features-image"
                    style={{
                      textAlign: 'center'
                    }}
                  >
                    <div className="item-wrapper">
                      <div className="image-wrap" style={{ textAlign: 'center' }}>
                        <img 
                          src={familyMember.image} 
                          alt={familyMember.alt || familyMember.name}
                          style={{
                            width: '100%',
                            maxWidth: '200px',
                            height: 'auto',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            display: 'inline-block'
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/assets/images/placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="content-wrap" style={{ textAlign: 'center' }}>
                        <h5 className="mbr-section-title card-title mbr-fonts-style align-center m-0 display-5">
                          <strong>{familyMember.name}</strong>
                        </h5>
                        <h6 className="mbr-role mbr-fonts-style align-center mb-3 display-4">
                          <strong>{familyMember.relation}</strong>
                        </h6>
                      </div>
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

export default MemberDetail; 