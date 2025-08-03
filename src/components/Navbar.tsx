import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown, Image } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa6';

// Icon wrapper component
const IconWrapper: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon: Icon, className, style }) => <Icon className={className} style={style} />;

const Navbar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'member' | 'admin' | null>(null);
  const [member, setMember] = useState<any>(null);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Check login status on component mount
  useEffect(() => {
    const memberToken = localStorage.getItem('memberToken');
    const adminToken = localStorage.getItem('adminToken');
    

    
    if (memberToken) {
      // Check if member has admin privileges
      fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/auth/member-me`, {
        headers: {
          'Authorization': `Bearer ${memberToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Token invalid');
      })
      .then(data => {

        setIsLoggedIn(true);
        setUserType(data.member.isAdmin ? 'admin' : 'member');
        setMember(data.member);
      })
      .catch((error) => {
        console.error('Member auth error:', error);
        localStorage.removeItem('memberToken');
        setIsLoggedIn(false);
        setUserType(null);
      });
    } else if (adminToken) {
      setIsLoggedIn(true);
      setUserType('admin');
    } else {
      setIsLoggedIn(false);
      setUserType(null);
    }
  }, []);



  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      if (event.detail?.member) {
        setMember(event.detail.member);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setUserType(null);
    setMember(null);
    window.location.href = '/';
  };

  return (
    <BootstrapNavbar 
      bg="white" 
      expand="xl" 
      fixed="top" 
      className="shadow-sm"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img 
            src="/assets/images/logo2-2-121x121.png" 
            alt="Rotary Club Logo" 
            className="me-2"
          />
          <span className="navbar-caption text-black text-primary display-7">
            Rotary Club of Cochin Lakeside
          </span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="navbar-nav" />

        <BootstrapNavbar.Collapse id="navbar-nav">
          {/* Main Navigation Items - Centered on desktop, centered on mobile */}
          <Nav className="mx-auto d-flex flex-column flex-xl-row align-items-center justify-content-center justify-content-xl-start">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`${isActive('/') ? 'active' : ''} text-center text-xl-start`}
              onClick={() => setExpanded(false)}
            >
              Home
            </Nav.Link>

            <NavDropdown 
              title="About Us" 
              id="about-dropdown"
              className={`${location.pathname.includes('/about') || 
                       location.pathname.includes('/directors') || 
                       location.pathname.includes('/past-presidents') ? 'active' : ''} text-center text-xl-start`}
            >
              <NavDropdown.Item as={Link} to="/about" onClick={() => setExpanded(false)}>
                About Us
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/directors" onClick={() => setExpanded(false)}>
                Board of Directors
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/past-presidents" onClick={() => setExpanded(false)}>
                Past Presidents
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link 
              as={Link} 
              to="/services" 
              className={`${isActive('/services') ? 'active' : ''} text-center text-xl-start`}
              onClick={() => setExpanded(false)}
            >
              Services
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/members" 
              className={`${isActive('/members') ? 'active' : ''} text-center text-xl-start`}
              onClick={() => setExpanded(false)}
            >
              Members
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/gallery" 
              className={`${isActive('/gallery') ? 'active' : ''} text-center text-xl-start`}
              onClick={() => setExpanded(false)}
            >
              Gallery
            </Nav.Link>

            <Nav.Link 
              href="#contact" 
              onClick={() => setExpanded(false)}
              className="text-center text-xl-start"
            >
              Contact Us
            </Nav.Link>
          </Nav>

          {/* User/Login Section - Right side on desktop, centered on mobile */}
          <Nav className="ms-auto d-flex flex-column flex-xl-row align-items-center justify-content-center justify-content-xl-end">
            {isLoggedIn ? (
              <NavDropdown 
                title={
                  <div className="d-flex align-items-center justify-content-center justify-content-xl-start">
                    <div className="position-relative me-3">
                      {member?.profileImage ? (
                        <Image 
                          src={member.profileImage} 
                          alt="Profile" 
                          roundedCircle
                          style={{ 
                            width: '36px', 
                            height: '36px', 
                            objectFit: 'cover',
                            border: '2px solid #e9ecef',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        />
                      ) : (
                        <div 
                          className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ 
                            width: '36px', 
                            height: '36px',
                            border: '2px solid #e9ecef',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            background: 'linear-gradient(135deg, #0066CC 0%, #003366 100%)'
                          }}
                        >
                          <IconWrapper icon={FaUser} className="text-white" style={{ fontSize: '16px' }} />
                        </div>
                      )}
                    </div>
                    <div className="d-none d-md-block">
                      <div className="fw-semibold text-dark" style={{ fontSize: '14px', lineHeight: '1.2' }}>
                        {member?.name || (userType === 'admin' ? 'Admin' : 'Member')}
                      </div>
                      <div className="text-muted" style={{ fontSize: '12px', lineHeight: '1.2' }}>
                        {member?.currentDesignation || (userType === 'admin' ? 'Administrator' : 'Member')}
                      </div>
                    </div>
                  </div>
                }
                id="user-dropdown"
                className="user-dropdown text-center text-xl-start"
              >
                <NavDropdown.Item as={Link} to="/profile" onClick={() => setExpanded(false)}>
                  <IconWrapper icon={FaUser} className="me-2" />
                  View Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                {userType === 'admin' && (
                  <NavDropdown.Item as={Link} to="/admin" onClick={() => setExpanded(false)}>
                    Admin Dashboard
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link 
                as={Link} 
                to="/auth" 
                className={`${isActive('/auth') ? 'active' : ''} text-center text-xl-start`}
                onClick={() => setExpanded(false)}
              >
                Member Login
              </Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
