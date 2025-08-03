import React, { useState } from 'react';
import { Modal, Form, Button, InputGroup } from 'react-bootstrap';
import { FaMagnifyingGlass } from 'react-icons/fa6';

// Icon wrapper component to fix TypeScript issues
const IconWrapper: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon: Icon, className, style }) => <Icon className={className} style={style} />;

interface Member {
  _id: string;
  id?: string; // Backend sometimes returns 'id' instead of '_id'
  name: string;
  email: string;
  classification: string;
  status: string;
  isActive: boolean;
  joinDate?: string;
  memberSince?: string;
  createdAt?: string;
  lastLogin?: string;
  hasLoggedIn?: boolean;
  loginStatus?: string;
  daysSinceLastLogin?: number;
  lastLoginText?: string;
  daysSinceSignup?: number;
  signupText?: string;
  // Additional member details
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
  bio?: string;
  family?: any[];
}

interface MemberSearchModalProps {
  show: boolean;
  onHide: () => void;
  onLinkMember: (member: Member, relationship: string) => Promise<void>;
}

const MemberSearchModal: React.FC<MemberSearchModalProps> = ({
  show,
  onHide,
  onLinkMember
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [searching, setSearching] = useState(false);

  const searchMembers = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${API_BASE_URL}/members?search=${encodeURIComponent(term)}&status=active`);
      
      if (!response.ok) {
        throw new Error('Failed to search members');
      }
      
      const data = await response.json();
      setSearchResults(data.members || []);
    } catch (error) {
      console.error('Error searching members:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchMembers(searchTerm);
  };

  const handleLinkMember = async (member: Member, relationship: string) => {
    await onLinkMember(member, relationship);
    setSearchTerm('');
    setSearchResults([]);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Link Existing Member as Family</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSearch}>
          <Form.Group className="mb-3">
            <Form.Label>Search Members</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search by name, email, or classification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
                                <Button type="submit" variant="outline-primary" disabled={searching}>
                    <IconWrapper icon={FaMagnifyingGlass} />
                  </Button>
            </InputGroup>
          </Form.Group>
        </Form>
        
        {searching && (
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Searching...</span>
            </div>
            <p className="mt-2 text-muted">Searching members...</p>
          </div>
        )}
        
        {searchResults.length > 0 && (
          <div className="mt-3">
            <h6>Search Results:</h6>
            <div className="list-group">
              {searchResults.map((member) => (
                <div key={member.id || member._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    {member.profileImage ? (
                      <img 
                        src={member.profileImage} 
                        alt={member.name}
                        className="rounded-circle me-3"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" 
                           style={{ width: '40px', height: '40px' }}>
                        <span className="text-muted">👤</span>
                      </div>
                    )}
                    <div>
                      <strong>{member.name}</strong>
                      <br />
                      <small className="text-muted">{member.email}</small>
                      {member.currentDesignation && (
                        <small className="text-muted d-block">{member.currentDesignation}</small>
                      )}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                                                    <Form.Select 
                                  size="sm" 
                                  style={{ width: '120px' }}
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleLinkMember(member, e.target.value);
                                    }
                                  }}
                                >
                                  <option value="">Select...</option>
                                  <option value="Spouse">Spouse</option>
                                  <option value="Child">Child</option>
                                  <option value="Parent">Parent</option>
                                  <option value="Sibling">Sibling</option>
                                  <option value="Brother">Brother</option>
                                  <option value="Sister">Sister</option>
                                  <option value="Father">Father</option>
                                  <option value="Mother">Mother</option>
                                  <option value="Son">Son</option>
                                  <option value="Daughter">Daughter</option>
                                  <option value="Grandfather">Grandfather</option>
                                  <option value="Grandmother">Grandmother</option>
                                  <option value="Uncle">Uncle</option>
                                  <option value="Aunt">Aunt</option>
                                  <option value="Cousin">Cousin</option>
                                  <option value="Other">Other</option>
                                </Form.Select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {searchTerm && !searching && searchResults.length === 0 && (
          <div className="text-center py-3 text-muted">
            <p>No members found matching "{searchTerm}"</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MemberSearchModal; 