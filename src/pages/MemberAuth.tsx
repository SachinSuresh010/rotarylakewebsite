import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Nav } from 'react-bootstrap';
import { FaUser, FaLock, FaKey, FaEnvelope, FaUserPlus, FaRightToBracket } from 'react-icons/fa6';

// Icon wrapper component
const IconWrapper: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon: Icon, className, style }) => <Icon className={className} style={style} />;

const MemberAuth: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [member, setMember] = useState<any>(null);
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  // Check if member is already logged in
  useEffect(() => {
    const token = localStorage.getItem('memberToken');
    if (token) {
      // Verify token and get member info
      fetch(`${API_BASE_URL}/auth/member-me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
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
        setMember(data.member);
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem('memberToken');
        setIsLoggedIn(false);
        setMember(null);
      });
    }
  }, [API_BASE_URL]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/member-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('memberToken', data.token);
        setMember(data.member);
        setIsLoggedIn(true);
        setSuccess('Login successful!');
        // Redirect to home page after successful login
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('memberToken');
    setIsLoggedIn(false);
    setMember(null);
    setSuccess('Logged out successfully!');
    setError('');
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const accessKey = formData.get('accessKey') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/member-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          accessKey
        })
      });

      if (response.ok) {
        setSuccess('Account created successfully! Please login.');
        setAuthMode('login');
        // Clear form
        e.currentTarget.reset();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Card className="shadow-lg border-0" style={{ 
                borderRadius: '20px', 
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
              }}>
                <Card.Header className="text-center text-white py-5" style={{ 
                  background: 'linear-gradient(135deg, #0066CC 0%, #003366 100%)',
                  border: 'none'
                }}>
                  <div className="mb-4">
                    <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '70px', height: '70px'}}>
                      <IconWrapper icon={FaUser} className="text-white fs-3" />
                    </div>
                  </div>
                  <h3 className="mb-2 fw-bold">Member Portal</h3>
                  <p className="text-light mb-0 opacity-75 fs-6">Rotary Club of Cochin Lakeside</p>
                </Card.Header>
                <Card.Body className="p-5">
                  {error && <Alert variant="danger" className="border-0 shadow-sm mb-4" style={{ borderRadius: '10px' }}>{error}</Alert>}
                  {success && <Alert variant="success" className="border-0 shadow-sm mb-4" style={{ borderRadius: '10px' }}>{success}</Alert>}
                  
                  {isLoggedIn ? (
                    <div className="text-center py-5">
                      <div className="mb-5">
                        <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '90px', height: '90px'}}>
                          <IconWrapper icon={FaUser} className="text-primary fs-1" />
                        </div>
                        <h4 className="fw-bold text-dark mb-3">Welcome, {member?.name}!</h4>
                        <p className="text-muted fs-5">You are logged in as a member.</p>
                      </div>
                      <div className="d-grid gap-4">
                        <Button 
                          variant="primary" 
                          size="lg"
                          onClick={() => window.location.href = '/'}
                          className="shadow-sm fw-semibold"
                          style={{ 
                            borderRadius: '12px', 
                            padding: '15px',
                            background: 'linear-gradient(135deg, #0066CC 0%, #003366 100%)',
                            border: 'none'
                          }}
                        >
                          <IconWrapper icon={FaUser} className="me-3" />
                          Go to Homepage
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          onClick={handleLogout}
                          className="shadow-sm fw-semibold"
                          style={{ borderRadius: '12px', padding: '15px' }}
                        >
                          Logout
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Nav variant="pills" className="mb-5 nav-fill" activeKey={authMode} onSelect={(k) => {
                        setAuthMode(k as 'login' | 'signup');
                        setError('');
                        setSuccess('');
                      }}>
                        <Nav.Item>
                          <Nav.Link eventKey="login" className="rounded-pill fw-semibold fs-6" style={{ padding: '12px 20px' }}>
                            <IconWrapper icon={FaRightToBracket} className="me-2" />
                            Login
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="signup" className="rounded-pill fw-semibold fs-6" style={{ padding: '12px 20px' }}>
                            <IconWrapper icon={FaUserPlus} className="me-2" />
                            Sign Up
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                      
                      {authMode === 'login' ? (
                        <Form onSubmit={handleLogin} className="needs-validation">
                          <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold text-dark mb-3 fs-6">
                              <IconWrapper icon={FaEnvelope} className="me-2" style={{ color: '#0066CC' }} />
                              Email Address
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              required
                              placeholder="Enter your email"
                              className="form-control-lg border-0 bg-light"
                              style={{
                                borderRadius: '12px', 
                                padding: '15px 20px',
                                fontSize: '16px'
                              }}
                            />
                          </Form.Group>
                          <Form.Group className="mb-5">
                            <Form.Label className="fw-semibold text-dark mb-3 fs-6">
                              <IconWrapper icon={FaLock} className="me-2" style={{ color: '#0066CC' }} />
                              Password
                            </Form.Label>
                            <Form.Control
                              type="password"
                              name="password"
                              required
                              placeholder="Enter your password"
                              className="form-control-lg border-0 bg-light"
                              style={{
                                borderRadius: '12px', 
                                padding: '15px 20px',
                                fontSize: '16px'
                              }}
                            />
                          </Form.Group>
                          <Button 
                            type="submit" 
                            variant="primary" 
                            size="lg"
                            className="w-100 mb-4 shadow-sm fw-semibold"
                            disabled={loading}
                            style={{
                              borderRadius: '12px', 
                              padding: '15px',
                              background: 'linear-gradient(135deg, #0066CC 0%, #003366 100%)',
                              border: 'none',
                              fontSize: '16px'
                            }}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Logging in...
                              </>
                            ) : (
                              <>
                                <IconWrapper icon={FaRightToBracket} className="me-2" />
                                Login
                              </>
                            )}
                          </Button>
                        </Form>
                      ) : (
                        <Form onSubmit={handleSignup} className="needs-validation">
                          <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold text-dark mb-3 fs-6">
                              <IconWrapper icon={FaUser} className="me-2" style={{ color: '#0066CC' }} />
                              Full Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              required
                              placeholder="Enter your full name"
                              className="form-control-lg border-0 bg-light"
                              style={{
                                borderRadius: '12px', 
                                padding: '15px 20px',
                                fontSize: '16px'
                              }}
                            />
                          </Form.Group>
                          <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold text-dark mb-3 fs-6">
                              <IconWrapper icon={FaEnvelope} className="me-2" style={{ color: '#0066CC' }} />
                              Email Address
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              required
                              placeholder="Enter your email"
                              className="form-control-lg border-0 bg-light"
                              style={{
                                borderRadius: '12px', 
                                padding: '15px 20px',
                                fontSize: '16px'
                              }}
                            />
                          </Form.Group>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold text-dark mb-3 fs-6">
                                  <IconWrapper icon={FaLock} className="me-2" style={{ color: '#0066CC' }} />
                                  Password
                                </Form.Label>
                                <Form.Control
                                  type="password"
                                  name="password"
                                  required
                                  placeholder="Enter password"
                                  className="form-control-lg border-0 bg-light"
                                  style={{
                                    borderRadius: '12px', 
                                    padding: '15px 20px',
                                    fontSize: '16px'
                                  }}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold text-dark mb-3 fs-6">
                                  <IconWrapper icon={FaLock} className="me-2" style={{ color: '#0066CC' }} />
                                  Confirm Password
                                </Form.Label>
                                <Form.Control
                                  type="password"
                                  name="confirmPassword"
                                  required
                                  placeholder="Confirm password"
                                  className="form-control-lg border-0 bg-light"
                                  style={{
                                    borderRadius: '12px', 
                                    padding: '15px 20px',
                                    fontSize: '16px'
                                  }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Form.Group className="mb-5">
                            <Form.Label className="fw-semibold text-dark mb-3 fs-6">
                              <IconWrapper icon={FaKey} className="me-2" style={{ color: '#0066CC' }} />
                              Access Key
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="accessKey"
                              required
                              placeholder="Enter access key provided by admin"
                              className="form-control-lg border-0 bg-light"
                              style={{
                                borderRadius: '12px', 
                                padding: '15px 20px',
                                fontSize: '16px'
                              }}
                            />
                            <Form.Text className="text-muted small mt-3">
                              <IconWrapper icon={FaKey} className="me-1" />
                              Contact the administrator to get your access key
                            </Form.Text>
                          </Form.Group>
                          <Button 
                            type="submit" 
                            variant="success" 
                            size="lg"
                            className="w-100 mb-4 shadow-sm fw-semibold"
                            disabled={loading}
                            style={{
                              borderRadius: '12px', 
                              padding: '15px',
                              background: 'linear-gradient(135deg, #28A745 0%, #1E7E34 100%)',
                              border: 'none',
                              fontSize: '16px'
                            }}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Creating Account...
                              </>
                            ) : (
                              <>
                                <IconWrapper icon={FaUserPlus} className="me-2" />
                                Create Account
                              </>
                            )}
                          </Button>
                        </Form>
                      )}
                      
                      <div className="text-center mt-5 pt-4 border-top">
                        <p className="text-muted mb-0 fs-6">
                          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                          <Button 
                            variant="link" 
                            className="p-0 fw-semibold text-decoration-none"
                            style={{ color: '#0066CC' }}
                            onClick={() => {
                              setAuthMode(authMode === 'login' ? 'signup' : 'login');
                              setError('');
                              setSuccess('');
                            }}
                          >
                            {authMode === 'login' ? 'Sign up here' : 'Login here'}
                          </Button>
                        </p>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default MemberAuth; 