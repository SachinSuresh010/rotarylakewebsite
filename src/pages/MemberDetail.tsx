import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

interface Member {
  id: string;
  name: string;
  email: string;
  classification?: string;
  status?: string;
  isAdmin?: boolean;
  isActive?: boolean; // Add isActive field
  createdAt?: Date;
  lastLogin?: Date;
  profileImage?: string;
  currentDesignation?: string;
  profession?: string;
  birthday?: string;
  hobbies?: string;
  familyMembers?: FamilyMember[];
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
  bio?: string;
  family?: FamilyMember[];
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  photo?: string;
  profession?: string;
  hobbies?: string;
  birthday?: string;
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
  // New fields for member linking
  memberId?: string; // ID of the member if they are also a member
  isMember?: boolean; // Flag to indicate if this family member is also a member
}

// Extended interface for family members who are also members
interface FamilyMemberWithMemberData extends FamilyMember {
  memberData?: Member; // Full member data if they are also a member
}

const MemberDetail: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [familyMembersWithData, setFamilyMembersWithData] = useState<FamilyMemberWithMemberData[]>([]);
  const [loadingFamilyMembers, setLoadingFamilyMembers] = useState(false);

  // Function to fetch member data for family members
  const fetchFamilyMemberData = useCallback(async (familyMembers: FamilyMember[]) => {
    if (!familyMembers || familyMembers.length === 0) return;

    setLoadingFamilyMembers(true);
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
    
    try {
      // Use the new family endpoint for better performance
      const familyResponse = await fetch(`${API_BASE_URL}/members/${memberId}/family`);
      if (!familyResponse.ok) {
        throw new Error('Failed to fetch family member data');
      }
      const familyData = await familyResponse.json();
      
      // Transform the data to match our interface
      const processedFamilyMembers: FamilyMemberWithMemberData[] = familyData.familyMembers.map((fm: any) => ({
        ...fm,
        memberData: fm.memberData ? {
          id: fm.memberData.id,
          name: fm.memberData.name,
          email: fm.memberData.email || '',
          classification: fm.memberData.classification,
          status: fm.memberData.status,
          isAdmin: fm.memberData.isAdmin,
          isActive: fm.memberData.isActive,
          createdAt: fm.memberData.createdAt,
          lastLogin: fm.memberData.lastLogin,
          profileImage: fm.memberData.profileImage,
          currentDesignation: fm.memberData.currentDesignation,
          profession: fm.memberData.profession,
          birthday: fm.memberData.birthday,
          hobbies: fm.memberData.hobbies,
          personalBio: fm.memberData.personalBio,
          personalDetails: fm.memberData.personalDetails,
          pastPositions: fm.memberData.pastPositions,
          isPastPresident: fm.memberData.isPastPresident,
          presidentialYears: fm.memberData.presidentialYears
        } : undefined
      }));

      setFamilyMembersWithData(processedFamilyMembers);
    } catch (err) {
      console.error('Error fetching family member data:', err);
      // Fallback to original family members without member data
      setFamilyMembersWithData(familyMembers.map(fm => ({ ...fm, isMember: false })));
    } finally {
      setLoadingFamilyMembers(false);
    }
  }, [memberId]);

  useEffect(() => {
    const loadMemberData = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${API_BASE_URL}/members/${memberId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!data.member) {
          throw new Error('Member not found');
        }
        
        setMember(data.member);
        
        // Fetch family member data if family members exist
        if (data.member.familyMembers && data.member.familyMembers.length > 0) {
          await fetchFamilyMemberData(data.member.familyMembers);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load member data');
      } finally {
        setLoading(false);
      }
    };

    if (memberId) {
      loadMemberData();
    }
  }, [memberId, fetchFamilyMemberData]);

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
    <div style={{ 
      paddingTop: '80px', 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
      minHeight: '100vh' 
    }}>
      {/* Hero Section with Member Profile */}
      <section style={{ 
        padding: '60px 0 40px 0',
        background: 'linear-gradient(135deg, #0066CC 0%, #003366 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }}></div>
        <Container>
          <Row className="align-items-center">
            <Col xs={12} lg={5}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}
              >
                {member.profileImage ? (
                  <div style={{
                    position: 'relative',
                    display: 'inline-block',
                    borderRadius: '20px',
                    padding: '8px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                  }}>
                    <img 
                      src={member.profileImage} 
                      alt={member.name}
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: 'auto',
                        borderRadius: '15px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        imageRendering: 'auto',
                        objectFit: 'cover',
                        maxHeight: '500px',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/assets/images/placeholder.jpg';
                      }}
                    />
                  </div>
                ) : (
                  <div 
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      height: '400px',
                      borderRadius: '20px',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                    }}
                  >
                    <span style={{ fontSize: '6rem', color: 'rgba(255,255,255,0.8)' }}>👤</span>
                  </div>
                )}
              </motion.div>
            </Col>
            <Col xs={12} lg={7}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ textAlign: 'left', position: 'relative', zIndex: 2 }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <h1 style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    {member.name}
                  </h1>
                  {member.currentDesignation && (
                    <p style={{
                      fontSize: '1.3rem',
                      marginBottom: '15px',
                      opacity: 0.9,
                      fontWeight: '500'
                    }}>
                      {member.currentDesignation}
                    </p>
                  )}
                  {member.isPastPresident && (
                    <span style={{
                      backgroundColor: '#ffc107',
                      color: '#000',
                      fontSize: '0.9rem',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginBottom: '15px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                      Past President
                    </span>
                  )}
                </div>
                
                {(member.personalBio || member.bio) && (
                  <div style={{
                    lineHeight: '1.8',
                    fontSize: '1.1rem',
                    opacity: 0.95,
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    {(member.personalBio || member.bio)!.split('\n').map((paragraph, index) => (
                      <React.Fragment key={index}>
                        {paragraph}
                        {index < (member.personalBio || member.bio)!.split('\n').length - 1 && (
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
        <section style={{ 
          padding: '60px 0', 
          background: 'white',
          position: 'relative'
        }}>
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '50px' }}
            >
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '10px'
              }}>
                About {member.name.split(' ')[0]}
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Learn more about their professional background and personal interests
              </p>
            </motion.div>
            
            <Row className="justify-content-center">
              {member.profession && (
                <Col xs={12} md={4} className="mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{
                      background: 'linear-gradient(135deg, #0066CC 0%, #003366 100%)',
                      borderRadius: '20px',
                      padding: '30px 20px',
                      textAlign: 'center',
                      color: 'white',
                      boxShadow: '0 10px 30px rgba(0,102,204,0.3)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{
                      fontSize: '3rem',
                      marginBottom: '20px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}>
                      💼
                    </div>
                    <h4 style={{
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      marginBottom: '15px',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                      Profession
                    </h4>
                    <p style={{
                      fontSize: '1.1rem',
                      opacity: 0.95,
                      lineHeight: '1.6',
                      margin: 0
                    }}>
                      {member.profession}
                    </p>
                  </motion.div>
                </Col>
              )}
              
              {member.hobbies && (
                <Col xs={12} md={4} className="mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{
                      background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                      borderRadius: '20px',
                      padding: '30px 20px',
                      textAlign: 'center',
                      color: 'white',
                      boxShadow: '0 10px 30px rgba(40,167,69,0.3)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{
                      fontSize: '3rem',
                      marginBottom: '20px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}>
                      🎨
                    </div>
                    <h4 style={{
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      marginBottom: '15px',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                      Hobbies
                    </h4>
                    <p style={{
                      fontSize: '1.1rem',
                      opacity: 0.95,
                      lineHeight: '1.6',
                      margin: 0
                    }}>
                      {member.hobbies}
                    </p>
                  </motion.div>
                </Col>
              )}
              
              {member.birthday && (
                <Col xs={12} md={4} className="mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    style={{
                      background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                      borderRadius: '20px',
                      padding: '30px 20px',
                      textAlign: 'center',
                      color: 'white',
                      boxShadow: '0 10px 30px rgba(220,53,69,0.3)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{
                      fontSize: '3rem',
                      marginBottom: '20px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}>
                      🎂
                    </div>
                    <h4 style={{
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      marginBottom: '15px',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                      Birthday
                    </h4>
                    <p style={{
                      fontSize: '1.1rem',
                      opacity: 0.95,
                      lineHeight: '1.6',
                      margin: 0
                    }}>
                      {member.birthday}
                    </p>
                  </motion.div>
                </Col>
              )}
            </Row>
          </Container>
        </section>
      )}



      {/* Family Section */}
      {familyMembersWithData.length > 0 && (
        <section style={{ 
          padding: '80px 0', 
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          position: 'relative',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%230066CC" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.5
          }}></div>
          <Container style={{ position: 'relative', zIndex: 2 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '60px' }}
            >
              <h2 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#0066CC',
                marginBottom: '15px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                👨‍👩‍👧‍👦 Family Members
              </h2>
              <p style={{
                fontSize: '1.2rem',
                color: '#666',
                maxWidth: '700px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                Meet the wonderful family behind our valued member
              </p>
            </motion.div>
            
            {loadingFamilyMembers ? (
              <Row className="justify-content-center">
                <Col xs={12}>
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading family members...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading family member details...</p>
                  </div>
                </Col>
              </Row>
            ) : (
                          <Row className="justify-content-center">
              {familyMembersWithData
                .filter(fm => fm.memberId !== memberId) // Exclude the current member from family list
                .map((familyMember, index) => (
                <Col key={familyMember.id} xs={12} lg={6} className="mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      borderRadius: '25px',
                      padding: '35px',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(0,102,204,0.1)',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.08)';
                    }}
                  >
                    {/* Background Pattern */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '120px',
                      height: '120px',
                      background: 'linear-gradient(135deg, #0066CC 0%, #003366 100%)',
                      borderRadius: '0 25px 0 120px',
                      opacity: 0.08
                    }}></div>
                    
                    <Row className="align-items-center">
                      {/* Family Member Photo */}
                      <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
                        {familyMember.photo ? (
                          <div style={{
                            position: 'relative',
                            display: 'inline-block'
                          }}>
                            <img 
                              src={familyMember.photo} 
                              alt={familyMember.name}
                              style={{
                                width: '140px',
                                height: '140px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                boxShadow: '0 12px 35px rgba(0,0,0,0.15)',
                                imageRendering: 'auto',
                                backfaceVisibility: 'hidden',
                                transform: 'translateZ(0)',
                                border: '5px solid white',
                                transition: 'all 0.3s ease'
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/assets/images/placeholder.jpg';
                              }}
                            />
                            {/* Glow effect */}
                            <div style={{
                              position: 'absolute',
                              top: '-10px',
                              left: '-10px',
                              right: '-10px',
                              bottom: '-10px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #0066CC 0%, #003366 100%)',
                              opacity: 0.2,
                              zIndex: -1,
                              filter: 'blur(15px)'
                            }}></div>
                          </div>
                        ) : (
                          <div 
                            style={{
                              width: '140px',
                              height: '140px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #0066CC 0%, #003366 100%)',
                              border: '5px solid white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto',
                              boxShadow: '0 12px 35px rgba(0,0,0,0.15)',
                              position: 'relative'
                            }}
                          >
                            <span style={{ fontSize: '3.5rem', color: 'white' }}>👤</span>
                            {/* Glow effect */}
                            <div style={{
                              position: 'absolute',
                              top: '-10px',
                              left: '-10px',
                              right: '-10px',
                              bottom: '-10px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #0066CC 0%, #003366 100%)',
                              opacity: 0.3,
                              zIndex: -1,
                              filter: 'blur(15px)'
                            }}></div>
                          </div>
                        )}
                      </Col>
                      
                      {/* Family Member Details */}
                      <Col xs={12} md={8}>
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <h4 style={{ 
                              color: '#0066CC', 
                              fontWeight: 'bold',
                              fontSize: '1.6rem',
                              margin: 0,
                              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                              {familyMember.name}
                            </h4>
                            {familyMember.isMember && (
                              <span style={{
                                background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                                color: 'white',
                                fontSize: '0.7rem',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 6px rgba(40,167,69,0.3)',
                                display: 'inline-block'
                              }}>
                                MEMBER
                              </span>
                            )}
                          </div>
                          <span style={{
                            background: 'linear-gradient(135deg, #0066CC 0%, #003366 100%)',
                            color: 'white',
                            fontSize: '0.85rem',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            fontWeight: '600',
                            boxShadow: '0 2px 8px rgba(0,102,204,0.3)',
                            display: 'inline-block'
                          }}>
                            {familyMember.relationship}
                          </span>
                          {familyMember.isMember && familyMember.memberData && (
                            <div style={{ marginTop: '10px' }}>
                              <Link 
                                to={`/members/${familyMember.memberId}`}
                                style={{
                                  background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                                  color: 'white',
                                  fontSize: '0.8rem',
                                  padding: '6px 12px',
                                  borderRadius: '15px',
                                  fontWeight: '600',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  boxShadow: '0 2px 8px rgba(0,123,255,0.3)',
                                  transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,123,255,0.4)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,123,255,0.3)';
                                }}
                              >
                                👤 View Full Profile
                              </Link>
                            </div>
                          )}
                        </div>
                        
                        {/* Family Member Details Grid */}
                        <div style={{ fontSize: '0.9rem' }}>
                          {/* Show member designation if they are a member */}
                          {familyMember.isMember && familyMember.memberData?.currentDesignation && (
                            <div style={{ marginBottom: '8px' }}>
                              <span style={{ color: '#ffc107', marginRight: '8px' }}>⭐</span>
                              <span style={{ color: '#666', fontWeight: '600' }}>
                                {familyMember.memberData.currentDesignation}
                              </span>
                            </div>
                          )}
                          
                          {familyMember.profession && (
                            <div style={{ marginBottom: '8px' }}>
                              <span style={{ color: '#007bff', marginRight: '8px' }}>💼</span>
                              <span style={{ color: '#666' }}>{familyMember.profession}</span>
                            </div>
                          )}
                          
                          {familyMember.hobbies && (
                            <div style={{ marginBottom: '8px' }}>
                              <span style={{ color: '#28a745', marginRight: '8px' }}>🎨</span>
                              <span style={{ color: '#666' }}>{familyMember.hobbies}</span>
                            </div>
                          )}
                          
                          {familyMember.birthday && (
                            <div style={{ marginBottom: '8px' }}>
                              <span style={{ color: '#dc3545', marginRight: '8px' }}>🎂</span>
                              <span style={{ color: '#666' }}>{familyMember.birthday}</span>
                            </div>
                          )}
                            
                          {familyMember.personalDetails?.phone && (
                            <div style={{ marginBottom: '8px' }}>
                              <span style={{ color: '#6c757d', marginRight: '8px' }}>📞</span>
                              <span style={{ color: '#666' }}>{familyMember.personalDetails.phone}</span>
                            </div>
                          )}
                          
                          {/* Show member-specific info if they are a member */}
                          {familyMember.isMember && familyMember.memberData && (
                            <>
                              {familyMember.memberData.classification && (
                                <div style={{ marginBottom: '8px' }}>
                                  <span style={{ color: '#6f42c1', marginRight: '8px' }}>🏷️</span>
                                  <span style={{ color: '#666' }}>
                                    <strong>Classification:</strong> {familyMember.memberData.classification}
                                  </span>
                                </div>
                              )}
                              {familyMember.memberData.isPastPresident && (
                                <div style={{ marginBottom: '8px' }}>
                                  <span style={{ color: '#ffc107', marginRight: '8px' }}>👑</span>
                                  <span style={{ color: '#666', fontWeight: '600' }}>
                                    Past President
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        
                        {/* About Section */}
                        {familyMember.personalBio && (
                          <div style={{ marginTop: '15px' }}>
                            <h6 style={{ 
                              color: '#495057', 
                              fontSize: '0.9rem',
                              fontWeight: 'bold',
                              marginBottom: '8px'
                            }}>
                              About {familyMember.name}
                            </h6>
                            <p style={{ 
                              fontSize: '0.85rem', 
                              lineHeight: '1.4',
                              color: '#666',
                              margin: 0
                            }}>
                              {familyMember.personalBio.length > 150 
                                ? `${familyMember.personalBio.substring(0, 150)}...` 
                                : familyMember.personalBio
                              }
                            </p>
                          </div>
                        )}
                        
                        {/* Additional Details */}
                        {(familyMember.personalDetails?.education || familyMember.personalDetails?.achievements) && (
                          <div style={{ marginTop: '15px' }}>
                            {familyMember.personalDetails?.education && (
                              <div style={{ marginBottom: '8px' }}>
                                <span style={{ color: '#007bff', marginRight: '8px' }}>🎓</span>
                                <span style={{ color: '#666', fontSize: '0.85rem' }}>
                                  <strong>Education:</strong> {familyMember.personalDetails.education}
                                </span>
                              </div>
                            )}
                            {familyMember.personalDetails?.achievements && (
                              <div style={{ marginBottom: '8px' }}>
                                <span style={{ color: '#ffc107', marginRight: '8px' }}>🏆</span>
                                <span style={{ color: '#666', fontSize: '0.85rem' }}>
                                  <strong>Achievements:</strong> {familyMember.personalDetails.achievements}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Social Media Links */}
                        {(familyMember.personalDetails?.socialMedia?.linkedin || 
                          familyMember.personalDetails?.socialMedia?.facebook || 
                          familyMember.personalDetails?.socialMedia?.twitter) && (
                          <div style={{ 
                            marginTop: '15px',
                            display: 'flex',
                            gap: '10px'
                          }}>
                            {familyMember.personalDetails.socialMedia?.linkedin && (
                              <a 
                                href={familyMember.personalDetails.socialMedia.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ 
                                  fontSize: '1.2rem', 
                                  color: '#0077b5', 
                                  textDecoration: 'none',
                                  transition: 'color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#0056b3'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#0077b5'}
                              >
                                💼
                              </a>
                            )}
                            {familyMember.personalDetails.socialMedia?.facebook && (
                              <a 
                                href={familyMember.personalDetails.socialMedia.facebook} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ 
                                  fontSize: '1.2rem', 
                                  color: '#1877f2', 
                                  textDecoration: 'none',
                                  transition: 'color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#0d6efd'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#1877f2'}
                              >
                                📘
                              </a>
                            )}
                            {familyMember.personalDetails.socialMedia?.twitter && (
                              <a 
                                href={familyMember.personalDetails.socialMedia.twitter} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ 
                                  fontSize: '1.2rem', 
                                  color: '#1da1f2', 
                                  textDecoration: 'none',
                                  transition: 'color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#0d8bd9'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#1da1f2'}
                              >
                                🐦
                              </a>
                            )}
                          </div>
                        )}
                      </Col>
                    </Row>
                  </motion.div>
                </Col>
              ))}
            </Row>
            )}
          </Container>
        </section>
      )}

      {/* Additional Personal Details Section */}
      {(member.personalDetails?.address || member.personalDetails?.phone || 
        member.personalDetails?.education || member.personalDetails?.achievements || 
        member.personalDetails?.interests) && (
        <section style={{ 
          padding: '80px 0', 
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%230066CC" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.5
          }}></div>
          
          <Container style={{ position: 'relative', zIndex: 2 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '60px' }}
            >
              <h2 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#0066CC',
                marginBottom: '15px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                📋 Additional Details
              </h2>
              <p style={{
                fontSize: '1.2rem',
                color: '#666',
                maxWidth: '700px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                Get to know more about {member.name.split(' ')[0]}'s background and achievements
              </p>
            </motion.div>
            
            <Row className="justify-content-center">
              {member.personalDetails?.address && (
                <Col xs={12} md={4} className="mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      borderRadius: '20px',
                      padding: '30px 25px',
                      textAlign: 'center',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(0,102,204,0.1)',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.08)';
                    }}
                  >
                    {/* Background Accent */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                      borderRadius: '0 20px 0 80px',
                      opacity: 0.1
                    }}></div>
                    
                    <div style={{
                      fontSize: '3rem',
                      marginBottom: '20px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}>
                      🏠
                    </div>
                    <h4 style={{
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      marginBottom: '15px',
                      color: '#007bff',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                      Address
                    </h4>
                    <p style={{
                      fontSize: '1rem',
                      color: '#666',
                      lineHeight: '1.6',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      {member.personalDetails.address}
                    </p>
                  </motion.div>
                </Col>
              )}
              
              {member.personalDetails?.phone && (
                <Col xs={12} md={4} className="mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      borderRadius: '20px',
                      padding: '30px 25px',
                      textAlign: 'center',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(40,167,69,0.1)',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.08)';
                    }}
                  >
                    {/* Background Accent */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                      borderRadius: '0 20px 0 80px',
                      opacity: 0.1
                    }}></div>
                    
                    <div style={{
                      fontSize: '3rem',
                      marginBottom: '20px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}>
                      📞
                    </div>
                    <h4 style={{
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      marginBottom: '15px',
                      color: '#28a745',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                      Phone
                    </h4>
                    <p style={{
                      fontSize: '1rem',
                      color: '#666',
                      lineHeight: '1.6',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      {member.personalDetails.phone}
                    </p>
                  </motion.div>
                </Col>
              )}
              
              {member.personalDetails?.education && (
                <Col xs={12} md={4} className="mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      borderRadius: '20px',
                      padding: '30px 25px',
                      textAlign: 'center',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(220,53,69,0.1)',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.08)';
                    }}
                  >
                    {/* Background Accent */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                      borderRadius: '0 20px 0 80px',
                      opacity: 0.1
                    }}></div>
                    
                    <div style={{
                      fontSize: '3rem',
                      marginBottom: '20px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}>
                      🎓
                    </div>
                    <h4 style={{
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      marginBottom: '15px',
                      color: '#dc3545',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                      Education
                    </h4>
                    <p style={{
                      fontSize: '1rem',
                      color: '#666',
                      lineHeight: '1.6',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      {member.personalDetails.education}
                    </p>
                  </motion.div>
                </Col>
              )}
            </Row>
            
            {(member.personalDetails?.achievements || member.personalDetails?.interests) && (
              <Row className="justify-content-center">
                {member.personalDetails?.achievements && (
                  <Col xs={12} md={6} className="mb-4">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        borderRadius: '20px',
                        padding: '35px 30px',
                        textAlign: 'center',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
                        border: '1px solid rgba(255,193,7,0.1)',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.08)';
                      }}
                    >
                      {/* Background Accent */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)',
                        borderRadius: '0 20px 0 100px',
                        opacity: 0.1
                      }}></div>
                      
                      <div style={{
                        fontSize: '3.5rem',
                        marginBottom: '25px',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                      }}>
                        🏆
                      </div>
                      <h4 style={{
                        fontSize: '1.4rem',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        color: '#ffc107',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}>
                        Achievements
                      </h4>
                      <p style={{
                        fontSize: '1.1rem',
                        color: '#666',
                        lineHeight: '1.7',
                        margin: 0,
                        fontWeight: '500'
                      }}>
                        {member.personalDetails.achievements}
                      </p>
                    </motion.div>
                  </Col>
                )}
                
                {member.personalDetails?.interests && (
                  <Col xs={12} md={6} className="mb-4">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        borderRadius: '20px',
                        padding: '35px 30px',
                        textAlign: 'center',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
                        border: '1px solid rgba(111,66,193,0.1)',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.08)';
                      }}
                    >
                      {/* Background Accent */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)',
                        borderRadius: '0 20px 0 100px',
                        opacity: 0.1
                      }}></div>
                      
                      <div style={{
                        fontSize: '3.5rem',
                        marginBottom: '25px',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                      }}>
                        ⭐
                      </div>
                      <h4 style={{
                        fontSize: '1.4rem',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        color: '#6f42c1',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}>
                        Interests
                      </h4>
                      <p style={{
                        fontSize: '1.1rem',
                        color: '#666',
                        lineHeight: '1.7',
                        margin: 0,
                        fontWeight: '500'
                      }}>
                        {member.personalDetails.interests}
                      </p>
                    </motion.div>
                  </Col>
                )}
              </Row>
            )}
            
            {/* Social Media Links */}
            {(member.personalDetails?.socialMedia?.linkedin || 
              member.personalDetails?.socialMedia?.facebook || 
              member.personalDetails?.socialMedia?.twitter) && (
              <Row className="justify-content-center">
                <Col xs={12}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      borderRadius: '20px',
                      padding: '40px 30px',
                      textAlign: 'center',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(0,102,204,0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Background Accent */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '120px',
                      height: '120px',
                      background: 'linear-gradient(135deg, #0066CC 0%, #003366 100%)',
                      borderRadius: '0 20px 0 120px',
                      opacity: 0.08
                    }}></div>
                    
                    <h4 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      marginBottom: '25px',
                      color: '#0066CC',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                      🌐 Connect on Social Media
                    </h4>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '25px',
                      flexWrap: 'wrap'
                    }}>
                      {member.personalDetails.socialMedia?.linkedin && (
                        <motion.a 
                          href={member.personalDetails.socialMedia.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textDecoration: 'none',
                            padding: '15px 20px',
                            borderRadius: '15px',
                            background: 'linear-gradient(135deg, #0077b5 0%, #0056b3 100%)',
                            color: 'white',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 25px rgba(0,119,181,0.3)',
                            minWidth: '120px'
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: '0 12px 35px rgba(0,119,181,0.4)'
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span style={{ fontSize: '2rem', marginBottom: '8px' }}>💼</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>LinkedIn</span>
                        </motion.a>
                      )}
                      {member.personalDetails.socialMedia?.facebook && (
                        <motion.a 
                          href={member.personalDetails.socialMedia.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textDecoration: 'none',
                            padding: '15px 20px',
                            borderRadius: '15px',
                            background: 'linear-gradient(135deg, #1877f2 0%, #0d6efd 100%)',
                            color: 'white',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 25px rgba(24,119,242,0.3)',
                            minWidth: '120px'
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: '0 12px 35px rgba(24,119,242,0.4)'
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span style={{ fontSize: '2rem', marginBottom: '8px' }}>📘</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Facebook</span>
                        </motion.a>
                      )}
                      {member.personalDetails.socialMedia?.twitter && (
                        <motion.a 
                          href={member.personalDetails.socialMedia.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textDecoration: 'none',
                            padding: '15px 20px',
                            borderRadius: '15px',
                            background: 'linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%)',
                            color: 'white',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 25px rgba(29,161,242,0.3)',
                            minWidth: '120px'
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: '0 12px 35px rgba(29,161,242,0.4)'
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span style={{ fontSize: '2rem', marginBottom: '8px' }}>🐦</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Twitter</span>
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                </Col>
              </Row>
            )}
          </Container>
        </section>
      )}
    </div>
  );
};

export default MemberDetail; 