import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaCalendar, FaCrown, FaPenToSquare, FaFloppyDisk, FaXmark, FaCamera, FaBriefcase, FaGraduationCap, FaHeart, FaUsers, FaLocationDot, FaPhone, FaTrophy, FaStar, FaLinkedin, FaFacebook, FaTwitter } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

// Icon wrapper component
const IconWrapper: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon: Icon, className, style }) => <Icon className={className} style={style} />;

interface Member {
  id: string;
  name: string;
  email: string;
  classification?: string;
  status?: string;
  isAdmin?: boolean;
  createdAt?: Date;
  lastLogin?: Date;
  profileImage?: string;
  currentDesignation?: string;
  profession?: string;
  birthday?: string;
  hobbies?: string;
  familyMembers?: Array<{
    id: string;
    name: string;
    relationship: string;
    photo?: string;
  }>;
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
}

const Profile: React.FC = () => {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    currentDesignation: '',
    profession: '',
    birthday: '',
    hobbies: '',
    familyMembers: [] as Array<{
      id: string;
      name: string;
      relationship: string;
      photo?: string;
    }>,
    personalBio: '',
    personalDetails: {
      address: '',
      phone: '',
      education: '',
      achievements: '',
      interests: '',
      socialMedia: {
        linkedin: '',
        facebook: '',
        twitter: ''
      }
    }
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAddFamilyMember, setShowAddFamilyMember] = useState(false);
  const [editingFamilyMember, setEditingFamilyMember] = useState<string | null>(null);
  const [newFamilyMember, setNewFamilyMember] = useState({
    name: '',
    relationship: '',
    photo: ''
  });
  const [familyMemberPhotoFile, setFamilyMemberPhotoFile] = useState<File | null>(null);
  const [uploadingFamilyPhoto, setUploadingFamilyPhoto] = useState(false);
  const familyPhotoInputRef = React.useRef<HTMLInputElement>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const relationshipOptions = [
    'Spouse', 'Fiancé', 'Father', 'Mother', 'Brother', 'Sister', 
    'Son', 'Daughter', 'Grandfather', 'Grandmother', 'Nephew', 'Niece',
    'Brother-In-Law', 'Sister-In-Law', 'Father-In-Law', 'Mother-In-Law',
    'Uncle', 'Aunt', 'Cousin', 'Other'
  ];
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    const token = localStorage.getItem('memberToken');
    if (!token) {
      navigate('/auth');
      return;
    }

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
      setEditForm({
        name: data.member.name,
        email: data.member.email,
        currentDesignation: data.member.currentDesignation || '',
        profession: data.member.profession || '',
        birthday: data.member.birthday || '',
        hobbies: data.member.hobbies || '',
        familyMembers: data.member.familyMembers || [],
        personalBio: data.member.personalBio || '',
        personalDetails: {
          address: data.member.personalDetails?.address || '',
          phone: data.member.personalDetails?.phone || '',
          education: data.member.personalDetails?.education || '',
          achievements: data.member.personalDetails?.achievements || '',
          interests: data.member.personalDetails?.interests || '',
          socialMedia: {
            linkedin: data.member.personalDetails?.socialMedia?.linkedin || '',
            facebook: data.member.personalDetails?.socialMedia?.facebook || '',
            twitter: data.member.personalDetails?.socialMedia?.twitter || ''
          }
        }
      });
    })
    .catch(() => {
      localStorage.removeItem('memberToken');
      navigate('/auth');
    })
    .finally(() => {
      setLoading(false);
    });
  }, [API_BASE_URL, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('memberToken');
    navigate('/');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: member?.name || '',
      email: member?.email || '',
      currentDesignation: member?.currentDesignation || '',
      profession: member?.profession || '',
      birthday: member?.birthday || '',
      hobbies: member?.hobbies || '',
      familyMembers: member?.familyMembers || [],
      personalBio: member?.personalBio || '',
      personalDetails: {
        address: member?.personalDetails?.address || '',
        phone: member?.personalDetails?.phone || '',
        education: member?.personalDetails?.education || '',
        achievements: member?.personalDetails?.achievements || '',
        interests: member?.personalDetails?.interests || '',
        socialMedia: {
          linkedin: member?.personalDetails?.socialMedia?.linkedin || '',
          facebook: member?.personalDetails?.socialMedia?.facebook || '',
          twitter: member?.personalDetails?.socialMedia?.twitter || ''
        }
      }
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('memberToken');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const data = await response.json();
        setMember(data.member);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploadingImage(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('memberToken');
    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/upload-profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setMember(data.member);
        setSelectedFile(null);
        setSuccess('Profile picture uploaded successfully!');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Dispatch custom event to update navbar
        window.dispatchEvent(new CustomEvent('profileUpdated', { 
          detail: { member: data.member } 
        }));
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to upload image');
      }
    } catch (error) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddFamilyMember = () => {
    if (!newFamilyMember.name || !newFamilyMember.relationship) {
      setError('Please fill in both name and relationship');
      return;
    }

    const familyMember = {
      id: Date.now().toString(),
      name: newFamilyMember.name,
      relationship: newFamilyMember.relationship,
      photo: newFamilyMember.photo
    };

    setEditForm({
      ...editForm,
      familyMembers: [...editForm.familyMembers, familyMember]
    });

    setNewFamilyMember({ name: '', relationship: '', photo: '' });
    setShowAddFamilyMember(false);
    setSuccess('Family member added successfully');
  };

  const handleRemoveFamilyMember = (id: string) => {
    setEditForm({
      ...editForm,
      familyMembers: editForm.familyMembers.filter(member => member.id !== id)
    });
    setSuccess('Family member removed successfully');
  };

  const handleEditFamilyMember = (familyMember: any) => {
    setEditingFamilyMember(familyMember.id);
    setNewFamilyMember({
      name: familyMember.name,
      relationship: familyMember.relationship,
      photo: familyMember.photo || ''
    });
    setFamilyMemberPhotoFile(null);
  };

  const handleUpdateFamilyMember = () => {
    if (!editingFamilyMember || !newFamilyMember.name || !newFamilyMember.relationship) {
      setError('Please fill in both name and relationship');
      return;
    }

    const updatedMembers = editForm.familyMembers.map(member => 
      member.id === editingFamilyMember 
        ? { ...member, ...newFamilyMember }
        : member
    );

    setEditForm({
      ...editForm,
      familyMembers: updatedMembers
    });

    setNewFamilyMember({ name: '', relationship: '', photo: '' });
    setEditingFamilyMember(null);
    setFamilyMemberPhotoFile(null);
    setSuccess('Family member updated successfully');
  };

  const handleCancelEditFamilyMember = () => {
    setNewFamilyMember({ name: '', relationship: '', photo: '' });
    setEditingFamilyMember(null);
    setFamilyMemberPhotoFile(null);
    setShowAddFamilyMember(false);
  };

  const handleFamilyPhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setFamilyMemberPhotoFile(file);
      setError('');
    }
  };

  const handleUploadFamilyPhoto = async () => {
    if (!familyMemberPhotoFile) {
      setError('Please select a photo first');
      return;
    }

    setUploadingFamilyPhoto(true);
    setError('');

    // For now, we'll convert the file to a data URL since the backend endpoint doesn't exist
    // In a real implementation, you'd want to create the upload-family-photo endpoint
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoDataUrl = e.target?.result as string;
      setNewFamilyMember({
        ...newFamilyMember,
        photo: photoDataUrl
      });
      setFamilyMemberPhotoFile(null);
      setSuccess(editingFamilyMember ? 'Family member photo updated successfully' : 'Family member photo added successfully');
      if (familyPhotoInputRef.current) {
        familyPhotoInputRef.current.value = '';
      }
      setUploadingFamilyPhoto(false);
    };
    reader.readAsDataURL(familyMemberPhotoFile);
  };



  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return null;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      paddingTop: '100px',
      paddingBottom: '50px'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
            {success && <Alert variant="success" className="mb-4">{success}</Alert>}
            
            <Card className="shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <Card.Header className="text-white py-4" style={{ 
                background: 'linear-gradient(135deg, #0066CC 0%, #003366 100%)',
                border: 'none'
              }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{ width: '60px', height: '60px' }}>
                      {member.profileImage ? (
                        <img 
                          src={member.profileImage} 
                          alt="Profile" 
                          className="rounded-circle"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <IconWrapper icon={FaUser} className="text-white fs-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="mb-1 fw-bold">{member.name}</h3>
                      <p className="mb-0 opacity-75">
                        {member.isAdmin ? 'Administrator' : 'Member'}
                        {member.isAdmin && <Badge bg="warning" className="ms-2">Admin</Badge>}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button 
                      variant="outline-light" 
                      size="sm"
                      onClick={handleLogout}
                      className="rounded-pill"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </Card.Header>

              <Card.Body className="p-4">
                <Row>
                  <Col md={8}>
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h5 className="fw-bold text-dark mb-0">Profile Information</h5>
                        {!isEditing ? (
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={handleEdit}
                            className="rounded-pill"
                          >
                            <IconWrapper icon={FaPenToSquare} className="me-2" />
                            Edit Profile
                          </Button>
                        ) : (
                          <div>
                            <Button 
                              variant="success" 
                              size="sm"
                              onClick={handleSave}
                              disabled={loading}
                              className="rounded-pill me-2"
                            >
                              <IconWrapper icon={FaFloppyDisk} className="me-2" />
                              Save
                            </Button>
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={handleCancel}
                              className="rounded-pill"
                            >
                              <IconWrapper icon={FaXmark} className="me-2" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <Form>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-2">
                                <Form.Label className="fw-semibold text-dark">
                                  <IconWrapper icon={FaUser} className="me-2" style={{ color: '#0066CC' }} />
                                  Full Name
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={editForm.name}
                                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  className="border-0 bg-light"
                                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-dark">
                                  <IconWrapper icon={FaEnvelope} className="me-2" style={{ color: '#0066CC' }} />
                                  Email Address
                                </Form.Label>
                                <Form.Control
                                  type="email"
                                  value={editForm.email}
                                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                  className="border-0 bg-light"
                                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-dark">
                                  <IconWrapper icon={FaBriefcase} className="me-2" style={{ color: '#0066CC' }} />
                                  Current Designation
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={editForm.currentDesignation}
                                  onChange={(e) => setEditForm({ ...editForm, currentDesignation: e.target.value })}
                                  placeholder="e.g., President, Secretary, Treasurer"
                                  className="border-0 bg-light"
                                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-dark">
                                  <IconWrapper icon={FaGraduationCap} className="me-2" style={{ color: '#0066CC' }} />
                                  Profession
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={editForm.profession}
                                  onChange={(e) => setEditForm({ ...editForm, profession: e.target.value })}
                                  placeholder="e.g., Doctor, Engineer, Business Owner"
                                  className="border-0 bg-light"
                                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-dark">
                                  <IconWrapper icon={FaCalendar} className="me-2" style={{ color: '#0066CC' }} />
                                  Birthday
                                </Form.Label>
                                <Form.Control
                                  type="date"
                                  value={editForm.birthday}
                                  onChange={(e) => setEditForm({ ...editForm, birthday: e.target.value })}
                                  className="border-0 bg-light"
                                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-dark">
                                  <IconWrapper icon={FaHeart} className="me-2" style={{ color: '#0066CC' }} />
                                  Hobbies
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={editForm.hobbies}
                                  onChange={(e) => setEditForm({ ...editForm, hobbies: e.target.value })}
                                  placeholder="e.g., Reading, Travel, Music"
                                  className="border-0 bg-light"
                                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={12}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-dark">
                                  <IconWrapper icon={FaUsers} className="me-2" style={{ color: '#0066CC' }} />
                                  Family Members
                                </Form.Label>
                                
                                {/* Display existing family members */}
                                {editForm.familyMembers.length > 0 && (
                                  <div className="mb-3">
                                    {editForm.familyMembers.map((familyMember) => (
                                      <div key={familyMember.id} className="d-flex align-items-center justify-content-between bg-white rounded-3 p-2 mb-2 border">
                                        <div className="d-flex align-items-center">
                                          <div className="position-relative">
                                                                                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" 
                                               style={{ width: '40px', height: '40px' }}>
                                              {familyMember.photo ? (
                                                <img 
                                                  src={familyMember.photo} 
                                                  alt={familyMember.name} 
                                                  className="rounded-circle"
                                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                              ) : (
                                                <IconWrapper icon={FaUser} className="text-muted" />
                                              )}
                                            </div>
                                            <div 
                                              className="position-absolute bottom-0 end-0 rounded-circle bg-primary d-flex align-items-center justify-content-center"
                                              style={{ 
                                                width: '20px', 
                                                height: '20px',
                                                cursor: 'pointer',
                                                zIndex: 1,
                                                border: '2px solid white',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                              }}
                                              title="Add Photo"
                                              onClick={() => {
                                                // For existing family members, we'll use a simple prompt for now
                                                // In a full implementation, you'd want a dedicated upload endpoint
                                                const photoUrl = prompt('Enter photo URL for ' + familyMember.name + ':');
                                                if (photoUrl) {
                                                  const updatedMembers = editForm.familyMembers.map(m => 
                                                    m.id === familyMember.id ? { ...m, photo: photoUrl } : m
                                                  );
                                                  setEditForm({
                                                    ...editForm,
                                                    familyMembers: updatedMembers
                                                  });
                                                }
                                              }}
                                            >
                                              <IconWrapper icon={FaCamera} style={{ fontSize: '10px', color: 'white' }} />
                                            </div>
                                          </div>
                                          <div>
                                            <div className="fw-semibold text-dark">{familyMember.name}</div>
                                            <small className="text-muted">{familyMember.relationship}</small>
                                          </div>
                                        </div>
                                        <div className="d-flex gap-1">
                                          <Button 
                                            variant="outline-primary" 
                                            size="sm"
                                            onClick={() => handleEditFamilyMember(familyMember)}
                                            className="rounded-pill"
                                            title="Edit"
                                          >
                                            <IconWrapper icon={FaPenToSquare} style={{ fontSize: '10px' }} />
                                          </Button>
                                          <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => handleRemoveFamilyMember(familyMember.id)}
                                            className="rounded-pill"
                                            title="Remove"
                                          >
                                            <IconWrapper icon={FaXmark} style={{ fontSize: '10px' }} />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Add/Edit family member form */}
                                {(showAddFamilyMember || editingFamilyMember) ? (
                                  <div className="bg-light rounded-3 p-3 border">
                                    <h6 className="fw-bold text-dark mb-3">
                                      {editingFamilyMember ? 'Edit Family Member' : 'Add New Family Member'}
                                    </h6>
                                    <Row>
                                      <Col md={6}>
                                        <Form.Group className="mb-3">
                                          <Form.Label className="fw-semibold text-dark">Name</Form.Label>
                                          <Form.Control
                                            type="text"
                                            value={newFamilyMember.name}
                                            onChange={(e) => setNewFamilyMember({ ...newFamilyMember, name: e.target.value })}
                                            placeholder="Family member name"
                                            className="border-0 bg-white"
                                            style={{ borderRadius: '8px', padding: '8px 12px' }}
                                          />
                                        </Form.Group>
                                      </Col>
                                      <Col md={6}>
                                        <Form.Group className="mb-3">
                                          <Form.Label className="fw-semibold text-dark">Relationship</Form.Label>
                                          <Form.Select
                                            value={newFamilyMember.relationship}
                                            onChange={(e) => setNewFamilyMember({ ...newFamilyMember, relationship: e.target.value })}
                                            className="border-0 bg-white"
                                            style={{ borderRadius: '8px', padding: '8px 12px' }}
                                          >
                                            <option value="">Select relationship</option>
                                            {relationshipOptions.map(option => (
                                              <option key={option} value={option}>{option}</option>
                                            ))}
                                          </Form.Select>
                                        </Form.Group>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col md={12}>
                                        <div className="d-flex align-items-center justify-content-between">
                                                                                      <div className="d-flex align-items-center">
                                              <div className="position-relative">
                                                                                              <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                                                   style={{ width: '40px', height: '40px' }}>
                                                  {newFamilyMember.photo ? (
                                                    <img 
                                                      src={newFamilyMember.photo} 
                                                      alt="Family member" 
                                                      className="rounded-circle"
                                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                  ) : (
                                                    <IconWrapper icon={FaUser} className="text-muted" />
                                                  )}
                                                </div>
                                                <div 
                                                  className="position-absolute bottom-0 end-0 rounded-circle bg-primary d-flex align-items-center justify-content-center"
                                                  style={{ 
                                                    width: '20px', 
                                                    height: '20px',
                                                    cursor: 'pointer',
                                                    zIndex: 1,
                                                    border: '2px solid white',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                  }}
                                                  title="Add Photo"
                                                  onClick={() => familyPhotoInputRef.current?.click()}
                                                >
                                                  <IconWrapper icon={FaCamera} style={{ fontSize: '10px', color: 'white' }} />
                                                </div>
                                              </div>
                                              <div className="flex-grow-1">
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                  {familyMemberPhotoFile && (
                                                    <small className="text-success fw-semibold">
                                                      {familyMemberPhotoFile.name}
                                                    </small>
                                                  )}
                                                  {familyMemberPhotoFile && (
                                                    <Button 
                                                      variant="success" 
                                                      size="sm"
                                                      onClick={handleUploadFamilyPhoto}
                                                      disabled={uploadingFamilyPhoto}
                                                      className="rounded-pill"
                                                    >
                                                      {uploadingFamilyPhoto ? (
                                                        <>
                                                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                          Uploading...
                                                        </>
                                                      ) : (
                                                        <>
                                                          <IconWrapper icon={FaFloppyDisk} className="me-1" />
                                                          Upload
                                                        </>
                                                      )}
                                                    </Button>
                                                  )}
                                                </div>
                                                <small className="text-muted">Click the camera icon to upload a photo</small>
                                              </div>
                                            </div>
                                            <input
                                              ref={familyPhotoInputRef}
                                              type="file"
                                              accept="image/*"
                                              onChange={handleFamilyPhotoSelect}
                                              style={{ display: 'none' }}
                                            />
                                          <div>
                                            <Button 
                                              variant="success" 
                                              size="sm"
                                              onClick={editingFamilyMember ? handleUpdateFamilyMember : handleAddFamilyMember}
                                              className="rounded-pill me-2"
                                              disabled={!newFamilyMember.name || !newFamilyMember.relationship}
                                            >
                                              <IconWrapper icon={FaFloppyDisk} className="me-1" />
                                              {editingFamilyMember ? 'Update' : 'Add'}
                                            </Button>
                                            <Button 
                                              variant="outline-secondary" 
                                              size="sm"
                                              onClick={editingFamilyMember ? handleCancelEditFamilyMember : () => setShowAddFamilyMember(false)}
                                              className="rounded-pill"
                                            >
                                              <IconWrapper icon={FaXmark} className="me-1" />
                                              Cancel
                                            </Button>
                                          </div>
                                        </div>

                                      </Col>
                                    </Row>
                                  </div>
                                ) : (
                                  <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    onClick={() => setShowAddFamilyMember(true)}
                                    className="rounded-pill"
                                  >
                                    <IconWrapper icon={FaUsers} className="me-2" />
                                    Add Family Member
                                  </Button>
                                )}
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={12}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-dark">
                                  <IconWrapper icon={FaUser} className="me-2" style={{ color: '#0066CC' }} />
                                  About Me
                                </Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={4}
                                  value={editForm.personalBio}
                                  onChange={(e) => setEditForm({ ...editForm, personalBio: e.target.value })}
                                  placeholder="Tell us about yourself, your background, interests, and what you do..."
                                  className="border-0 bg-light"
                                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          {/* Additional Personal Details */}
                          <Row>
                            <Col md={12}>
                              <h6 className="fw-bold text-dark mb-3 mt-4">Additional Personal Details</h6>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-dark">
                                  <IconWrapper icon={FaLocationDot} className="me-2" style={{ color: '#0066CC' }} />
                                  Address
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={editForm.personalDetails.address}
                                  onChange={(e) => setEditForm({ 
                                    ...editForm, 
                                    personalDetails: { 
                                      ...editForm.personalDetails, 
                                      address: e.target.value 
                                    } 
                                  })}
                                  placeholder="Your address"
                                  className="border-0 bg-light"
                                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-dark">
                                  <IconWrapper icon={FaPhone} className="me-2" style={{ color: '#0066CC' }} />
                                  Phone Number
                                </Form.Label>
                                <Form.Control
                                  type="tel"
                                  value={editForm.personalDetails.phone}
                                  onChange={(e) => setEditForm({ 
                                    ...editForm, 
                                    personalDetails: { 
                                      ...editForm.personalDetails, 
                                      phone: e.target.value 
                                    } 
                                  })}
                                  placeholder="Your phone number"
                                  className="border-0 bg-light"
                                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-dark">
                                  <IconWrapper icon={FaGraduationCap} className="me-2" style={{ color: '#0066CC' }} />
                                  Education
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={editForm.personalDetails.education}
                                  onChange={(e) => setEditForm({ 
                                    ...editForm, 
                                    personalDetails: { 
                                      ...editForm.personalDetails, 
                                      education: e.target.value 
                                    } 
                                  })}
                                  placeholder="Your educational background"
                                  className="border-0 bg-light"
                                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-dark">
                                  <IconWrapper icon={FaTrophy} className="me-2" style={{ color: '#0066CC' }} />
                                  Achievements
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={editForm.personalDetails.achievements}
                                  onChange={(e) => setEditForm({ 
                                    ...editForm, 
                                    personalDetails: { 
                                      ...editForm.personalDetails, 
                                      achievements: e.target.value 
                                    } 
                                  })}
                                  placeholder="Your notable achievements"
                                  className="border-0 bg-light"
                                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={12}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-dark">
                                  <IconWrapper icon={FaStar} className="me-2" style={{ color: '#0066CC' }} />
                                  Interests
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={editForm.personalDetails.interests}
                                  onChange={(e) => setEditForm({ 
                                    ...editForm, 
                                    personalDetails: { 
                                      ...editForm.personalDetails, 
                                      interests: e.target.value 
                                    } 
                                  })}
                                  placeholder="Your interests and passions"
                                  className="border-0 bg-light"
                                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          {/* Social Media Links */}
                          <Row>
                            <Col md={12}>
                              <h6 className="fw-bold text-dark mb-3">Social Media Links</h6>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-dark">
                                  <IconWrapper icon={FaLinkedin} className="me-2" style={{ color: '#0066CC' }} />
                                  LinkedIn
                                </Form.Label>
                                <Form.Control
                                  type="url"
                                  value={editForm.personalDetails.socialMedia.linkedin}
                                  onChange={(e) => setEditForm({ 
                                    ...editForm, 
                                    personalDetails: { 
                                      ...editForm.personalDetails, 
                                      socialMedia: { 
                                        ...editForm.personalDetails.socialMedia, 
                                        linkedin: e.target.value 
                                      } 
                                    } 
                                  })}
                                  placeholder="LinkedIn profile URL"
                                  className="border-0 bg-light"
                                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-dark">
                                  <IconWrapper icon={FaFacebook} className="me-2" style={{ color: '#0066CC' }} />
                                  Facebook
                                </Form.Label>
                                <Form.Control
                                  type="url"
                                  value={editForm.personalDetails.socialMedia.facebook}
                                  onChange={(e) => setEditForm({ 
                                    ...editForm, 
                                    personalDetails: { 
                                      ...editForm.personalDetails, 
                                      socialMedia: { 
                                        ...editForm.personalDetails.socialMedia, 
                                        facebook: e.target.value 
                                      } 
                                    } 
                                  })}
                                  placeholder="Facebook profile URL"
                                  className="border-0 bg-light"
                                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-dark">
                                  <IconWrapper icon={FaTwitter} className="me-2" style={{ color: '#0066CC' }} />
                                  Twitter
                                </Form.Label>
                                <Form.Control
                                  type="url"
                                  value={editForm.personalDetails.socialMedia.twitter}
                                  onChange={(e) => setEditForm({ 
                                    ...editForm, 
                                    personalDetails: { 
                                      ...editForm.personalDetails, 
                                      socialMedia: { 
                                        ...editForm.personalDetails.socialMedia, 
                                        twitter: e.target.value 
                                      } 
                                    } 
                                  })}
                                  placeholder="Twitter profile URL"
                                  className="border-0 bg-light"
                                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Form>
                      ) : (
                        <div>
                          {/* Basic Information */}
                          <div className="bg-light rounded-3 p-3 mb-3">
                            <h6 className="fw-bold text-dark mb-2">Basic Information</h6>
                            <Row>
                              <Col md={6}>
                                <div className="mb-2">
                                  <small className="text-muted fw-semibold">
                                    <IconWrapper icon={FaUser} className="me-2" style={{ color: '#0066CC' }} />
                                    Full Name
                                  </small>
                                  <p className="mb-0 fw-semibold text-dark">{member.name}</p>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="mb-3">
                                  <small className="text-muted fw-semibold">
                                    <IconWrapper icon={FaEnvelope} className="me-2" style={{ color: '#0066CC' }} />
                                    Email Address
                                  </small>
                                  <p className="mb-0 fw-semibold text-dark">{member.email}</p>
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6}>
                                <div className="mb-3">
                                  <small className="text-muted fw-semibold">
                                    <IconWrapper icon={FaBriefcase} className="me-2" style={{ color: '#0066CC' }} />
                                    Current Designation
                                  </small>
                                  <p className="mb-0 fw-semibold text-dark">
                                    {member.currentDesignation || 'Not specified'}
                                  </p>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="mb-3">
                                  <small className="text-muted fw-semibold">
                                    <IconWrapper icon={FaGraduationCap} className="me-2" style={{ color: '#0066CC' }} />
                                    Profession
                                  </small>
                                  <p className="mb-0 fw-semibold text-dark">
                                    {member.profession || 'Not specified'}
                                  </p>
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6}>
                                <div className="mb-3">
                                  <small className="text-muted fw-semibold">
                                    <IconWrapper icon={FaCalendar} className="me-2" style={{ color: '#0066CC' }} />
                                    Birthday
                                  </small>
                                  <p className="mb-0 fw-semibold text-dark">
                                    {member.birthday ? formatDate(member.birthday) : 'Not specified'}
                                  </p>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="mb-3">
                                  <small className="text-muted fw-semibold">
                                    <IconWrapper icon={FaHeart} className="me-2" style={{ color: '#0066CC' }} />
                                    Hobbies
                                  </small>
                                  <p className="mb-0 fw-semibold text-dark">
                                    {member.hobbies || 'Not specified'}
                                  </p>
                                </div>
                              </Col>
                            </Row>
                          </div>

                          {/* Family Members */}
                          {member.familyMembers && member.familyMembers.length > 0 && (
                            <div className="bg-light rounded-3 p-3 mb-3">
                              <h6 className="fw-bold text-dark mb-2">Family Members</h6>
                                                              <div className="row g-2">
                                  {member.familyMembers.map((familyMember) => (
                                    <div key={familyMember.id} className="col-md-6">
                                                                            <div className="d-flex align-items-center bg-white rounded-3 p-2 border">
                                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" 
                                             style={{ width: '40px', height: '40px' }}>
                                        {familyMember.photo ? (
                                          <img 
                                            src={familyMember.photo} 
                                            alt={familyMember.name} 
                                            className="rounded-circle"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                          />
                                        ) : (
                                          <IconWrapper icon={FaUser} className="text-muted" />
                                        )}
                                      </div>
                                      <div>
                                        <div className="fw-semibold text-dark">{familyMember.name}</div>
                                        <small className="text-muted">{familyMember.relationship}</small>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* About Me */}
                          {member.personalBio && (
                            <div className="bg-light rounded-3 p-3 mb-3">
                              <h6 className="fw-bold text-dark mb-2">About Me</h6>
                              <p className="mb-0 fw-semibold text-dark">{member.personalBio}</p>
                            </div>
                          )}

                          {/* Additional Personal Details */}
                          {(member.personalDetails?.address || member.personalDetails?.phone || 
                            member.personalDetails?.education || member.personalDetails?.achievements || 
                            member.personalDetails?.interests) && (
                            <div className="bg-light rounded-3 p-3 mb-3">
                              <h6 className="fw-bold text-dark mb-2">Additional Personal Details</h6>
                              <Row>
                                {member.personalDetails?.address && (
                                  <Col md={6}>
                                    <div className="mb-3">
                                      <small className="text-muted fw-semibold">
                                        <IconWrapper icon={FaLocationDot} className="me-2" style={{ color: '#0066CC' }} />
                                        Address
                                      </small>
                                      <p className="mb-0 fw-semibold text-dark">{member.personalDetails.address}</p>
                                    </div>
                                  </Col>
                                )}
                                {member.personalDetails?.phone && (
                                  <Col md={6}>
                                    <div className="mb-3">
                                      <small className="text-muted fw-semibold">
                                        <IconWrapper icon={FaPhone} className="me-2" style={{ color: '#0066CC' }} />
                                        Phone
                                      </small>
                                      <p className="mb-0 fw-semibold text-dark">{member.personalDetails.phone}</p>
                                    </div>
                                  </Col>
                                )}
                              </Row>
                              <Row>
                                {member.personalDetails?.education && (
                                  <Col md={6}>
                                    <div className="mb-3">
                                      <small className="text-muted fw-semibold">
                                        <IconWrapper icon={FaGraduationCap} className="me-2" style={{ color: '#0066CC' }} />
                                        Education
                                      </small>
                                      <p className="mb-0 fw-semibold text-dark">{member.personalDetails.education}</p>
                                    </div>
                                  </Col>
                                )}
                                {member.personalDetails?.achievements && (
                                  <Col md={6}>
                                    <div className="mb-3">
                                      <small className="text-muted fw-semibold">
                                        <IconWrapper icon={FaTrophy} className="me-2" style={{ color: '#0066CC' }} />
                                        Achievements
                                      </small>
                                      <p className="mb-0 fw-semibold text-dark">{member.personalDetails.achievements}</p>
                                    </div>
                                  </Col>
                                )}
                              </Row>
                              {member.personalDetails?.interests && (
                                <Row>
                                  <Col md={12}>
                                    <div className="mb-3">
                                      <small className="text-muted fw-semibold">
                                        <IconWrapper icon={FaStar} className="me-2" style={{ color: '#0066CC' }} />
                                        Interests
                                      </small>
                                      <p className="mb-0 fw-semibold text-dark">{member.personalDetails.interests}</p>
                                    </div>
                                  </Col>
                                </Row>
                              )}
                              {(member.personalDetails?.socialMedia?.linkedin || 
                                member.personalDetails?.socialMedia?.facebook || 
                                member.personalDetails?.socialMedia?.twitter) && (
                                <Row>
                                  <Col md={12}>
                                    <div className="mb-3">
                                      <small className="text-muted fw-semibold mb-2 d-block">
                                        Social Media
                                      </small>
                                      <div className="d-flex gap-2">
                                        {member.personalDetails.socialMedia?.linkedin && (
                                          <a href={member.personalDetails.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                            <IconWrapper icon={FaLinkedin} className="text-primary fs-5" />
                                          </a>
                                        )}
                                        {member.personalDetails.socialMedia?.facebook && (
                                          <a href={member.personalDetails.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                            <IconWrapper icon={FaFacebook} className="text-primary fs-5" />
                                          </a>
                                        )}
                                        {member.personalDetails.socialMedia?.twitter && (
                                          <a href={member.personalDetails.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                            <IconWrapper icon={FaTwitter} className="text-primary fs-5" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <h6 className="fw-bold text-dark mb-2">Account Details</h6>
                      <div className="bg-light rounded-3 p-3">
                        <Row>
                          <Col md={6}>
                            <div className="mb-3">
                              <small className="text-muted fw-semibold">
                                <IconWrapper icon={FaCalendar} className="me-2" style={{ color: '#0066CC' }} />
                                Member Since
                              </small>
                              <p className="mb-0 fw-semibold text-dark">
                                {formatDate(member.createdAt || '')}
                              </p>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <small className="text-muted fw-semibold">
                                <IconWrapper icon={FaCalendar} className="me-2" style={{ color: '#0066CC' }} />
                                Last Login
                              </small>
                              <p className="mb-0 fw-semibold text-dark">
                                {formatDate(member.lastLogin || '')}
                              </p>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <div className="mb-3">
                              <small className="text-muted fw-semibold">
                                <IconWrapper icon={FaCrown} className="me-2" style={{ color: '#0066CC' }} />
                                Classification
                              </small>
                              <p className="mb-0 fw-semibold text-dark">
                                {member.classification || 'Member'}
                              </p>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <small className="text-muted fw-semibold">
                                Status
                              </small>
                              <div>
                                <Badge 
                                  bg={member.status === 'active' ? 'success' : 'secondary'}
                                  className="fw-semibold"
                                >
                                  {member.status || 'Active'}
                                </Badge>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="text-center">
                      <div className="position-relative mb-4">
                        <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" 
                             style={{ width: '150px', height: '150px' }}>
                          {member.profileImage ? (
                            <img 
                              src={member.profileImage} 
                              alt="Profile" 
                              className="rounded-circle"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <IconWrapper icon={FaUser} className="text-primary" style={{ fontSize: '4rem' }} />
                          )}
                        </div>
                        <Button 
                          variant="primary" 
                          size="sm"
                          className="position-absolute bottom-0 end-0 rounded-circle"
                          style={{ width: '40px', height: '40px' }}
                          title="Upload Photo"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <IconWrapper icon={FaCamera} />
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          style={{ display: 'none' }}
                        />
                      </div>
                      
                      {selectedFile && (
                        <div className="mb-3 p-3 bg-light rounded-3">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <small className="text-muted">
                              Selected: {selectedFile.name}
                            </small>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => {
                                setSelectedFile(null);
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = '';
                                }
                              }}
                            >
                              ×
                            </Button>
                          </div>
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={handleUploadImage}
                            disabled={uploadingImage}
                            className="w-100"
                          >
                            {uploadingImage ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <IconWrapper icon={FaCamera} className="me-2" />
                                Upload Photo
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                      
                      <div className="bg-light rounded-3 p-3">
                        <h6 className="fw-bold text-dark mb-2">Quick Actions</h6>
                        <div className="d-grid gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => navigate('/members')}
                            className="rounded-pill"
                          >
                            View All Members
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => navigate('/')}
                            className="rounded-pill"
                          >
                            Go to Homepage
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile; 