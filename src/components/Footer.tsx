import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="footer footer4 cid-tnERSFypqt" id="contact">
      <Container>
        <Row className="mbr-white">
          {/* Logo Section */}
          <Col xs={6} lg={3}>
            <div className="media-wrap col-md-8 col-12">
              <a href="/">
                <img 
                  src="/assets/images/logo2-2-121x121.png" 
                  alt="Logo"
                />
              </a>
            </div>
          </Col>
          
          {/* Meetings Section */}
          <Col xs={12} md={6} lg={3}>
            <h5 className="mbr-section-subtitle mbr-fonts-style mb-2 display-7">
              <strong>Meetings</strong>
            </h5>
            <p className="mbr-text mbr-fonts-style mb-4 display-4">
              The club meets every Thursday 8 PM at Classik Fort Hotel, Maradu, Tripunithura
            </p>
            
            {/* Follow Us Section */}
            <h5 className="mbr-section-subtitle mbr-fonts-style mb-3 display-7">
              <strong>Follow Us</strong>
            </h5>
            <div className="social-row display-7">
              <div className="soc-item">
                <a href="https://www.facebook.com/rotarycochinlakeside" target="_blank" rel="noopener noreferrer">
                  <span className="mbr-iconfont socicon-facebook socicon"></span>
                </a>
              </div>
              <div className="soc-item">
                <a href="https://www.youtube.com/@rotarycochinlakeside" target="_blank" rel="noopener noreferrer">
                  <span className="mbr-iconfont socicon-youtube socicon"></span>
                </a>
              </div>
              <div className="soc-item">
                <a href="https://www.instagram.com/rotarycochinlakeside/" target="_blank" rel="noopener noreferrer">
                  <span className="mbr-iconfont socicon-instagram socicon"></span>
                </a>
              </div>
            </div>
          </Col>
          
          {/* Our Projects Section */}
          <Col xs={12} md={6} lg={3}>
            <h5 className="mbr-section-subtitle mbr-fonts-style mb-2 display-7">
              <strong>Our Projects</strong>
            </h5>
            <ul className="list mbr-fonts-style display-4">
              <li className="mbr-text item-wrap">Project Soukhyam</li>
              <li className="mbr-text item-wrap">Project Karuthal</li>
              <li className="mbr-text item-wrap"><br /></li>
            </ul>
          </Col>
          
          {/* Contact Us Section */}
          <Col xs={12} md={6} lg={3}>
            <h5 className="mbr-section-subtitle mbr-fonts-style mb-2 display-7">
              <strong>Contact Us</strong>
            </h5>
            <ul className="list mbr-fonts-style display-4">
              <li className="mbr-text item-wrap">Rotary Club of Cochin Lakeside</li>
              <li className="mbr-text item-wrap">Thursday 08:00 pm at Classik Fort Hotel, Ernakulam</li>
              <li className="mbr-text item-wrap"><br /></li>
              <li className="mbr-text item-wrap">Email: rotarycochinlakeside@gmail.com</li>
              <li className="mbr-text item-wrap">Phone: +91 6238547692</li>
              <li className="mbr-text item-wrap"></li>
            </ul>
          </Col>
        </Row>
        
        {/* Copyright Section */}
        <Row>
          <Col xs={12} className="mt-4">
            <p className="mbr-text mb-0 mbr-fonts-style copyright align-center display-7">
              © Copyright 2025 RC Cochin Lakeside - All Rights Reserved
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
