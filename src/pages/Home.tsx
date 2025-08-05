import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Carousel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePageTitle } from '../hooks/usePageTitle';
import MemberImage from '../components/MemberImage';

interface Director {
  id: string;
  name: string;
  profileImage?: string;
  image?: string; // Legacy field for backward compatibility
  alt?: string;
  currentDesignation?: string;
  isPastPresident?: boolean;
  presidentialYears?: string[];
  profession?: string;
  hobbies?: string;
  birthday?: string;
  bio?: string;
}

interface DirectorsResponse {
  directors: Director[];
}

interface HomeContent {
  hero?: {
    title?: string;
    subtitle?: string;
    description?: string;
    images?: string[];
    isActive?: boolean;
  };
  services?: {
    title?: string;
    subtitle?: string;
    description?: string;
    items?: Array<{
      title: string;
      image: string;
      description: string;
      link: string;
      isActive?: boolean;
    }>;
    isActive?: boolean;
  };
}

const Home: React.FC = () => {
  usePageTitle('Home');
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [directorsData, setDirectorsData] = useState<DirectorsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Load directors data from backend API
  useEffect(() => {
    const loadDirectorsData = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${API_BASE_URL}/members/directors/current`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDirectorsData(data);
      } catch (err) {
        console.error('Error loading directors data:', err);
        // Fallback to static data if API fails
        try {
          const fallbackResponse = await fetch('/assets/data/members.json');
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            // Filter for directors from static data
            const directors = fallbackData.members.filter((member: any) => 
              member.currentDesignation && member.currentDesignation.trim() !== ''
            );
            setDirectorsData({ directors });
          }
        } catch (fallbackErr) {
          console.error('Error loading fallback data:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDirectorsData();
  }, []);

  const directors = directorsData?.directors || [];

  // Sort directors to show President, Secretary, Treasurer first, then others
  const sortedDirectors = directors.sort((a, b) => {
    const priorityOrder: { [key: string]: number } = {
      'President': 1,
      'Secretary': 2,
      'Treasurer': 3,
      'president': 1,
      'secretary': 2,
      'treasurer': 3,
      'PRESIDENT': 1,
      'SECRETARY': 2,
      'TREASURER': 3
    };
    
    const aDesignation = a.currentDesignation || '';
    const bDesignation = b.currentDesignation || '';
    
    const aPriority = priorityOrder[aDesignation] || 999;
    const bPriority = priorityOrder[bDesignation] || 999;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    // If same priority, sort alphabetically by name
    return a.name.localeCompare(b.name);
  });

  // Static fallback content
  const staticServices = [
    {
      title: "Community Service",
      image: "/assets/images/whatsapp-image-2022-07-02-at-11.34.51-am-2-1256x942.jpg",
      description: "Serving our local community through various initiatives and projects.",
      link: "/services"
    },
    {
      title: "Vocational Service",
      image: "/assets/images/01dfe298-3f1c-467e-84b5-c7f515c39563-1256x942.jpg",
      description: "Promoting vocational excellence and professional development.",
      link: "/services"
    },
    {
      title: "International Service",
      image: "/assets/images/b6b2b5b2-89ec-42a7-b24e-39ae7aa74696-1024x576.jpg",
      description: "Building international understanding and cooperation.",
      link: "/services"
    },
    {
      title: "Youth Service",
      image: "/assets/images/1063984c-9732-4052-ab2a-332df3f973c6-1600x721.jpg",
      description: "Empowering young people through leadership and service opportunities.",
      link: "/services"
    },
    {
      title: "Club Service",
      image: "/assets/images/532bbc11-85c6-4296-8b42-b940726854b9-1256x707.jpg",
      description: "Strengthening our club through fellowship and effective administration.",
      link: "/gallery"
    }
  ];

  const staticHeroImages = [
    "/assets/images/29cce85f-3867-4dff-b9d0-00549b5eef17-1280x853.jpg",
    "/assets/images/a7eac4de-03fe-4f44-893a-b80d7af1b098-1280x853.jpg",
    "/assets/images/817d1ab1-18a1-449b-84b3-4b353be3fbee-1280x853.jpg"
  ];

  // State for dynamic content
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  // Fetch home content from API
  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${API_BASE_URL}/home/content`);
        
        if (response.ok) {
          const data = await response.json();
          setHomeContent(data);
        } else {
          console.warn('Failed to fetch home content, using static content');
          setHomeContent(null);
        }
      } catch (error) {
        console.error('Error fetching home content:', error);
        setContentError('Failed to load dynamic content');
        setHomeContent(null);
      }
    };

    fetchHomeContent();
  }, []);

  // Use dynamic content if available, otherwise fall back to static content
  const services = homeContent?.services?.items || staticServices;
  const heroImages = homeContent?.hero?.images || staticHeroImages;

  // Responsive slides calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 992) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.max(1, sortedDirectors.length - slidesToShow + 1));
      }, 7000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, sortedDirectors.length, slidesToShow]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, sortedDirectors.length - slidesToShow + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, sortedDirectors.length - slidesToShow + 1)) % Math.max(1, sortedDirectors.length - slidesToShow + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.min(index, sortedDirectors.length - slidesToShow));
  };

  return (
    <div>
      {/* Hero Section - Full Screen Carousel */}
      <section 
        className="hero-section mbr-fullscreen" 
        id="slider1-l"
      >
        <Carousel 
          className="carousel slide carousel-fade" 
          interval={5000}
          fade
          style={{ width: '100%', margin: 0, padding: 0 }}
        >
          {heroImages.map((image: string, index: number) => (
            <Carousel.Item key={index} className="slider-image item">
              <div className="item-wrapper" style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}>
                <img
                  className="d-block w-100"
                  src={image}
                  alt={`Hero slide ${index + 1}`}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    objectPosition: 'center',
                    margin: 0,
                    padding: 0
                  }}
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* Services Section */}
      <section className="features4 cid-tnETaZ4gAu services-section" id="features4-n" style={{ marginTop: 0 }}>
        <div className="mbr-overlay"></div>
        <Container>
          {contentError && (
            <div className="alert alert-warning text-center mb-4" role="alert">
              <strong>Note:</strong> Using static content due to connection issues. 
              {homeContent && <span className="ms-2">✅ Dynamic content loaded successfully!</span>}
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mbr-section-head"
          >
            <Row className="text-center">
              <Col>
                <h4 className="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
                  <strong>{homeContent?.services?.title || 'Services'}</strong>
                </h4>
                <h5 className="mbr-section-subtitle mbr-fonts-style align-center mb-0 mt-2 display-5">
                  {homeContent?.services?.subtitle || 'Rotary avenues of service'}
                </h5>
                {homeContent?.services?.description && (
                  <p className="mbr-section-description mbr-fonts-style align-center mb-0 mt-2 display-7">
                    {homeContent.services.description}
                  </p>
                )}
              </Col>
            </Row>
          </motion.div>

          <Row className="mt-4">
            {services.map((service: any, index: number) => (
              <Col key={index} xs={12} md={6} lg={6} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="item features-image"
                >
                  <div className="item-wrapper">
                    <div className="item-img">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="img-fluid"
                        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="item-content">
                      <h5 className="item-title mbr-fonts-style display-5">
                        <strong>{service.title}</strong>
                      </h5>
                      <p className="mbr-text mbr-fonts-style display-7">
                        {service.description}
                      </p>
                    </div>
                    <div className="mbr-section-btn item-footer mt-2">
                      <Button 
                        variant="outline-dark" 
                        size="sm"
                        className="btn item-btn btn-black display-7"
                        href={service.link}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Directors Section - Custom Carousel */}
      <section className="people5 mbr-embla cid-tnEVo7HlkB" id="people5-p">
        <div className="position-relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <h3 className="mbr-fonts-style display-2">
              <strong>Our Directors</strong>
            </h3>
          </motion.div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading directors...</p>
            </div>
          ) : sortedDirectors.length === 0 ? (
            <div className="text-center py-5">
              <div className="alert alert-warning" role="alert">
                <h4>No Directors Data</h4>
                <p>No directors data found.</p>
              </div>
            </div>
          ) : (
            <div className="embla" style={{ position: 'relative', maxWidth: '100%', margin: '0 auto' }}>
              <div className="embla__viewport" style={{ overflow: 'hidden' }}>
                <div 
                  className="embla__container" 
                  style={{ 
                    display: 'flex', 
                    transition: 'transform 0.5s ease-in-out',
                    transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`
                  }}
                >
                  {sortedDirectors.map((director, index) => (
                    <div 
                      key={director.id || index} 
                      className="embla__slide slider-image item" 
                      style={{ 
                        minWidth: `${100 / slidesToShow}%`, 
                        padding: '0 15px',
                        marginLeft: '0rem', 
                        marginRight: '0rem',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <div className="user">
                        <div className="user_image">
                          <Link to={`/members/${director.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="item-wrapper position-relative">
                              <MemberImage 
                                member={director}
                                size="medium"
                                onClick={() => {}}
                              />
                            </div>
                          </Link>
                        </div>
                        <div className="user_text mb-4">
                          <p className="mbr-fonts-style display-7"></p>
                        </div>
                        <Link to={`/members/${director.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div className="user_name mbr-fonts-style mb-2 display-7" style={{ cursor: 'pointer' }}>
                            <strong>{director.name}</strong>
                            {director.isPastPresident && (
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
                          </div>
                        </Link>
                        <div className="user_desk mbr-fonts-style display-7">
                          {director.currentDesignation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            
            {/* Navigation Buttons */}
            <button 
              className="embla__button embla__button--prev"
              onClick={prevSlide}
              style={{
                position: 'absolute',
                top: '50%',
                left: '10px',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.7)',
                border: '2px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: slidesToShow === 1 ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                setIsAutoPlaying(false);
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                setIsAutoPlaying(true);
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
              <span className="sr-only visually-hidden visually-hidden">Previous</span>
            </button>
            
            <button 
              className="embla__button embla__button--next"
              onClick={nextSlide}
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.7)',
                border: '2px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: slidesToShow === 1 ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                setIsAutoPlaying(false);
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                setIsAutoPlaying(true);
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
              <span className="sr-only visually-hidden visually-hidden">Next</span>
            </button>

            {/* Dots Indicator */}
            <div style={{ 
              position: 'absolute', 
              bottom: '-30px', 
              left: '50%', 
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px'
            }}>
              {Array.from({ length: Math.max(1, sortedDirectors.length - slidesToShow + 1) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    border: 'none',
                    background: index === currentSlide ? '#007bff' : '#ccc',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                />
              ))}
            </div>
          </div>
        )}
        </div>
      </section>
    </div>
  );
};

export default Home;