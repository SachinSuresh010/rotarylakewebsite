import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const Navbar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <BootstrapNavbar 
      bg="white" 
      expand="lg" 
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
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={isActive('/') ? 'active' : ''}
              onClick={() => setExpanded(false)}
            >
              Home
            </Nav.Link>

            <NavDropdown 
              title="About Us" 
              id="about-dropdown"
              className={location.pathname.includes('/about') || 
                       location.pathname.includes('/directors') || 
                       location.pathname.includes('/past-presidents') ? 'active' : ''}
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
              className={isActive('/services') ? 'active' : ''}
              onClick={() => setExpanded(false)}
            >
              Services
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/members" 
              className={isActive('/members') ? 'active' : ''}
              onClick={() => setExpanded(false)}
            >
              Members
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/gallery" 
              className={isActive('/gallery') ? 'active' : ''}
              onClick={() => setExpanded(false)}
            >
              Gallery
            </Nav.Link>

            <Nav.Link 
              href="#contact" 
              onClick={() => setExpanded(false)}
            >
              Contact Us
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
