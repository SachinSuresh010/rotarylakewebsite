import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Nav, Table, Badge, InputGroup, Spinner, Modal } from 'react-bootstrap';
import { FaUsers, FaChartBar, FaGear, FaRightFromBracket, FaPlus, FaPenToSquare, FaTrash, FaMagnifyingGlass, FaClock, FaUserCheck, FaUserXmark, FaEye, FaCalendar, FaEnvelope, FaUser, FaBriefcase, FaGraduationCap, FaHeart, FaLocationDot, FaPhone, FaTrophy, FaStar, FaXmark, FaLinkedin, FaFacebook, FaTwitter, FaCamera, FaFloppyDisk, FaTag, FaImages, FaCalendarDay, FaImage, FaKey } from 'react-icons/fa6';
import MemberSearchModal from '../components/MemberSearchModal';
import { usePageTitle } from '../hooks/usePageTitle';


// Icon wrapper components to fix TypeScript issues
const IconWrapper: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon: Icon, className, style }) => <Icon className={className} style={style} />;

// Modern CSS for the admin panel
const modernStyles = `
  /* Modern Admin Panel Styles */
  .admin-modern {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: calc(100vh - 200px);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    padding: 6rem 0 2rem 0 !important;
    margin-top: 2rem;
    position: relative;
    z-index: 1;
  }
  
  .admin-sidebar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  .admin-main {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    margin: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  }
  
  .admin-content {
    margin: 0 20px;
  }
  
  .admin-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    margin: 20px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    margin-top: 1rem;
  }
  
  .admin-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: none;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .admin-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  }
  
  .admin-stats-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    border: none;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;
  }
  
  .admin-stats-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  }
  
  .admin-nav {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    border: none;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    margin: 0 20px;
  }
  
  .admin-nav .nav-link {
    border: none;
    color: #64748b;
    font-weight: 600;
    padding: 16px 24px;
    border-radius: 12px;
    margin: 4px 8px;
    transition: all 0.3s ease;
  }
  
  .admin-nav .nav-link:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
  
  .admin-nav .nav-link.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  }
  
  .admin-btn {
    border: none;
    border-radius: 12px;
    font-weight: 600;
    padding: 12px 24px;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-decoration: none;
    cursor: pointer;
  }
  
  .admin-btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  }
  
  .admin-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    color: white;
  }
  
  .admin-btn-outline {
    background: rgba(255, 255, 255, 0.9);
    color: #667eea;
    border: 2px solid rgba(102, 126, 234, 0.2);
  }
  
  .admin-btn-outline:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    transform: translateY(-2px);
  }
  
  .admin-btn-secondary {
    background: rgba(255, 255, 255, 0.9);
    color: #64748b;
    border: 2px solid rgba(100, 116, 139, 0.2);
  }
  
  .admin-btn-secondary:hover {
    background: rgba(100, 116, 139, 0.1);
    color: #64748b;
    transform: translateY(-2px);
  }
  
  .admin-btn-danger {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
  }
  
  .admin-btn-danger:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
    color: white;
  }
  
  .admin-btn-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  }
  
  .admin-btn-success:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
    color: white;
  }
  
  .admin-form-control {
    border: 2px solid rgba(100, 116, 139, 0.2);
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9);
  }
  
  .admin-form-control:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }
  
  .admin-text-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .admin-stats-icon {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  .admin-stats-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .admin-stats-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
  
  .admin-stats-warning {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  
  .admin-stats-danger {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }
  
  .admin-stats-info {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  }
  
  .admin-spinner {
    color: #667eea;
  }
  
  .admin-login-container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    border: none;
  }
  
  .admin-login-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 24px 24px 0 0;
    border: none;
    padding: 32px;
    text-align: center;
  }
  
  .admin-login-body {
    padding: 32px;
  }
  
  .admin-modal {
    border-radius: 24px;
    border: none;
  }
  
  .admin-modal-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 24px 24px 0 0;
    border: none;
    padding: 24px;
  }
  
  .admin-modal-body {
    padding: 24px;
    background: rgba(255, 255, 255, 0.95);
  }
  
  .admin-modal-footer {
    background: rgba(248, 250, 252, 0.95);
    border-radius: 0 0 24px 24px;
    border: none;
    padding: 24px;
  }
  
  .admin-nav-link {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }
  
  .admin-table {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  .admin-table th {
    background: rgba(102, 126, 234, 0.1);
    border: none;
    font-weight: 600;
    color: #667eea;
    padding: 16px;
  }
  
  .admin-table td {
    border: none;
    padding: 16px;
    vertical-align: middle;
  }
  
  .admin-table tbody tr:hover {
    background: rgba(102, 126, 234, 0.05);
  }
  
  .admin-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .admin-badge-success {
    background: rgba(16, 185, 129, 0.1);
    color: #059669;
  }
  
  .admin-badge-warning {
    background: rgba(245, 158, 11, 0.1);
    color: #d97706;
  }
  
  .admin-badge-danger {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
  }
  
  .admin-badge-info {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
  
  /* Responsive Design */
  @media (max-width: 1200px) {
    .admin-modern {
      padding: 4rem 0 2rem 0 !important;
    }
    
    .admin-main {
      margin: 10px;
    }
    
    .admin-header {
      margin: 10px;
      padding: 20px;
    }
    
    .admin-nav {
      margin: 0 10px;
    }
  }
  
  @media (max-width: 992px) {
    .admin-modern {
      padding: 3rem 0 2rem 0 !important;
    }
    
    .admin-header {
      padding: 16px;
    }
    
    .admin-header .d-flex {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start !important;
    }
    
    .admin-nav .nav-link {
      padding: 12px 16px;
      margin: 2px 4px;
      font-size: 14px;
    }
    
    .admin-nav .nav-link span {
      display: none;
    }
    
    .admin-nav .nav-link {
      justify-content: center;
    }
  }
  
  @media (max-width: 768px) {
    .admin-modern {
      padding: 2rem 0 1rem 0 !important;
      margin-top: 1rem;
    }
    
    .admin-main {
      margin: 5px;
      border-radius: 16px;
    }
    
    .admin-header {
      margin: 5px;
      border-radius: 16px;
      padding: 16px;
    }
    
    .admin-nav {
      margin: 0 5px;
      border-radius: 12px;
    }
    
    .admin-nav .nav-link {
      padding: 10px 12px;
      margin: 1px 2px;
      font-size: 12px;
      border-radius: 8px;
    }
    
    .admin-btn {
      padding: 10px 16px;
      font-size: 14px;
    }
    
    .admin-stats-icon {
      width: 50px;
      height: 50px;
      font-size: 20px;
    }
    
    .admin-login-container {
      margin: 0 10px;
    }
    
    .admin-login-header {
      padding: 24px 16px;
    }
    
    .admin-login-body {
      padding: 24px 16px;
    }
    
    .admin-modal {
      margin: 10px;
    }
    
    .admin-modal-header {
      padding: 16px;
    }
    
    .admin-modal-body {
      padding: 16px;
    }
    
    .admin-modal-footer {
      padding: 16px;
    }
    
    .admin-table {
      font-size: 14px;
    }
    
    .admin-table th,
    .admin-table td {
      padding: 12px 8px;
    }
  }
  
  @media (max-width: 576px) {
    .admin-modern {
      padding: 1rem 0 0.5rem 0 !important;
    }
    
    .admin-main {
      margin: 2px;
      border-radius: 12px;
    }
    
    .admin-header {
      margin: 2px;
      border-radius: 12px;
      padding: 12px;
    }
    
    .admin-nav {
      margin: 0 2px;
      border-radius: 8px;
    }
    
    .admin-nav .nav-link {
      padding: 8px 10px;
      margin: 1px;
      font-size: 11px;
      border-radius: 6px;
    }
    
    .admin-btn {
      padding: 8px 12px;
      font-size: 12px;
    }
    
    .admin-stats-icon {
      width: 40px;
      height: 40px;
      font-size: 16px;
    }
    
    .admin-login-container {
      margin: 0 5px;
    }
    
    .admin-login-header {
      padding: 20px 12px;
    }
    
    .admin-login-body {
      padding: 20px 12px;
    }
    
    .admin-modal {
      margin: 5px;
    }
    
    .admin-modal-header {
      padding: 12px;
    }
    
    .admin-modal-body {
      padding: 12px;
    }
    
    .admin-modal-footer {
      padding: 12px;
    }
    
    .admin-table {
      font-size: 12px;
    }
    
    .admin-table th,
    .admin-table td {
      padding: 8px 6px;
    }
    
    .admin-form-control {
      padding: 10px 12px;
      font-size: 12px;
    }
  }
  
  /* Mobile Navigation Improvements */
  @media (max-width: 768px) {
    .admin-nav .nav {
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .admin-nav .nav-item {
      flex: 1;
      min-width: 80px;
    }
    
    .admin-nav .nav-link {
      text-align: center;
      flex-direction: column;
      gap: 4px;
    }
    
    .admin-nav .nav-link svg {
      font-size: 16px;
    }
  }
  
  /* Dashboard Responsive Cards */
  @media (max-width: 768px) {
    .admin-dashboard-stats .row > div {
      margin-bottom: 16px;
    }
    
    .admin-dashboard-stats .card {
      margin-bottom: 0;
    }
  }
  
  /* Table Responsive */
  @media (max-width: 768px) {
    .admin-table-responsive {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    
    .admin-table-responsive .table {
      min-width: 600px;
    }
    
    .admin-card {
      margin-bottom: 0.5rem;
    }
    
    .admin-card .card-body {
      padding: 0.75rem;
    }
    
    .admin-card h6 {
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }
    
    .admin-card p {
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
    }
    
    .admin-card .btn {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
    }
  }
  
  /* Form Responsive */
  @media (max-width: 768px) {
    .admin-form-row {
      flex-direction: column;
    }
    
    .admin-form-row > div {
      margin-bottom: 16px;
    }
    
    .admin-form-row > div:last-child {
      margin-bottom: 0;
    }
  }
  
  /* Modal Responsive */
  @media (max-width: 576px) {
    .admin-modal {
      margin: 0;
      border-radius: 0;
      height: 100vh;
      max-height: 100vh;
    }
    
    .admin-modal-header {
      border-radius: 0;
    }
    
    .admin-modal-footer {
      border-radius: 0;
    }
  }
  
  /* Search and Filter Responsive */
  @media (max-width: 768px) {
    .admin-search-filters {
      flex-direction: column;
      gap: 12px;
    }
    
    .admin-search-filters > div {
      width: 100%;
    }
    
    .admin-search-filters .btn {
      width: 100%;
      margin-top: 8px;
    }
  }
  
  /* Pagination Responsive */
  @media (max-width: 576px) {
    .admin-pagination {
      flex-direction: column;
      gap: 8px;
      align-items: center;
    }
    
    .admin-pagination .pagination {
      margin: 0;
    }
  }
  
  /* Gallery Responsive */
  @media (max-width: 768px) {
    .admin-gallery-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }
  }
  
  @media (max-width: 576px) {
    .admin-gallery-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 8px;
    }
  }
  
  /* Services Responsive */
  @media (max-width: 768px) {
    .admin-services-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
  
  /* Settings Responsive */
  @media (max-width: 768px) {
    .admin-settings-section {
      padding: 16px;
    }
    
    .admin-settings-card {
      margin-bottom: 16px;
    }
  }
`;

// Inject the styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = modernStyles;
  document.head.appendChild(styleSheet);
}

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  profile?: {
    firstName?: string;
    lastName?: string;
  };
}

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

interface DashboardStats {
  members: {
    total: number;
    active: number;
    currentDirectors: number;
    pastPresidents: number;
  };
  users: {
    total: number;
    active: number;
  };
}

interface MemberStatistics {
  totalMembers: number;
  activeMembers: number;
  membersWithLogin: number;
  recentLogins: number;
  loginRate: number;
}

interface GalleryYear {
  id: string;
  year: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  isActive: boolean;
  createdAt?: string;
}

interface GalleryEvent {
  id: string;
  year: string;
  name: string;
  description: string;
  thumbnail: string;
  images: {
    id: string;
    src: string;
    alt: string;
  }[];
  isActive: boolean;
  createdAt?: string;
}

const GalleryTab: React.FC<{
  galleryYears: GalleryYear[];
  galleryEvents: GalleryEvent[];
  loading: boolean;
  error: string | null;
  success: string | null;
  showYearModal: boolean;
  setShowYearModal: (show: boolean) => void;
  showEventModal: boolean;
  setShowEventModal: (show: boolean) => void;
  newYear: any;
  setNewYear: (year: any) => void;
  newEvent: any;
  setNewEvent: (event: any) => void;
  handleCreateYear: (e: React.FormEvent) => void;
  handleCreateEvent: (e: React.FormEvent) => void;
  handleEditYear: (year: GalleryYear) => void;
  handleDeleteYear: (yearId: string) => void;
  handleEditEvent: (event: GalleryEvent) => void;
  handleDeleteEvent: (eventId: string) => void;
  yearImage: File | null;
  setYearImage: (file: File | null) => void;
  eventThumbnail: File | null;
  setEventThumbnail: (file: File | null) => void;
  eventImages: File[];
  setEventImages: (files: File[]) => void;
  editingYear: GalleryYear | null;
  editingEvent: GalleryEvent | null;
  setEditingYear: (year: GalleryYear | null) => void;
  setEditingEvent: (event: GalleryEvent | null) => void;
  existingEventImages: { id: string; src: string; alt: string }[];
  setExistingEventImages: (images: { id: string; src: string; alt: string }[]) => void;
}> = ({ 
  galleryYears, 
  galleryEvents, 
  loading, 
  error, 
  success,
  showYearModal,
  setShowYearModal,
  showEventModal,
  setShowEventModal,
  newYear,
  setNewYear,
  newEvent,
  setNewEvent,
  handleCreateYear,
  handleCreateEvent,
  handleEditYear,
  handleDeleteYear,
  handleEditEvent,
  handleDeleteEvent,
  yearImage,
  setYearImage,
  eventThumbnail,
  setEventThumbnail,
  eventImages,
  setEventImages,
  editingYear,
  editingEvent,
  setEditingYear,
  setEditingEvent,
  existingEventImages,
  setExistingEventImages
}) => {
  // State for image previews
  const [yearImagePreview, setYearImagePreview] = React.useState<string>('');
  const [eventThumbnailPreview, setEventThumbnailPreview] = React.useState<string>('');
  const [eventImagesPreviews, setEventImagesPreviews] = React.useState<string[]>([]);

  // Handle year image preview
  React.useEffect(() => {
    if (yearImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setYearImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(yearImage);
    } else {
      setYearImagePreview('');
    }
  }, [yearImage]);

  // Handle event thumbnail preview
  React.useEffect(() => {
    if (eventThumbnail) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEventThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(eventThumbnail);
    } else {
      setEventThumbnailPreview('');
    }
  }, [eventThumbnail]);

  // Handle event images previews
  React.useEffect(() => {
    const previews: string[] = [];
    eventImages.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target?.result as string);
        if (previews.length === eventImages.length) {
          setEventImagesPreviews([...previews]);
        }
      };
      reader.readAsDataURL(file);
    });
    if (eventImages.length === 0) {
      setEventImagesPreviews([]);
    }
  }, [eventImages]);

  // Set existing event images when editing
  React.useEffect(() => {
    if (editingEvent) {
      setExistingEventImages(editingEvent.images || []);
    } else {
      setExistingEventImages([]);
    }
  }, [editingEvent, setExistingEventImages]);

  const handleYearImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setYearImage(file);
  };

  const handleEventThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEventThumbnail(file);
  };

  const handleEventImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    setEventImages(files);
  };

  const removeExistingEventImage = (imageId: string) => {
    setExistingEventImages(existingEventImages.filter(img => img.id !== imageId));
  };

  const clearYearImage = () => {
    setYearImage(null);
    setYearImagePreview('');
  };

  const clearEventThumbnail = () => {
    setEventThumbnail(null);
    setEventThumbnailPreview('');
  };

  const clearEventImages = () => {
    setEventImages([]);
    setEventImagesPreviews([]);
  };

  return (
    <div>
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">{success}</Alert>}

      <Row>
        <Col lg={12}>
          <Card className="admin-stats-card mb-4">
            <Card.Header className="admin-modal-header">
              <div className="d-flex align-items-center">
                <div className="admin-stats-icon admin-stats-primary me-3">
                  <IconWrapper icon={FaImages} />
                </div>
                <div>
                  <h5 className="mb-1 text-white fw-bold">Gallery Management</h5>
                  <p className="mb-0 opacity-90 text-white">Manage gallery years and events with images</p>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Col lg={6}>
                  <Card className="admin-stats-card h-100">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 fw-bold">
                                                 <IconWrapper icon={FaCalendar} className="me-2" />
                        Gallery Years
                      </h6>
                      <Button 
                        variant="success" 
                        size="sm" 
                        onClick={() => {
                          setEditingYear(null);
                          setNewYear({ year: '', title: '', description: '', alt: '' });
                          setYearImage(null);
                          setYearImagePreview('');
                          setShowYearModal(true);
                        }}
                      >
                        <IconWrapper icon={FaPlus} className="me-1" />
                        Add Year
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      {loading ? (
                        <div className="text-center py-4">
                          <Spinner animation="border" size="sm" />
                          <p className="mt-2 text-muted">Loading gallery years...</p>
                        </div>
                      ) : galleryYears.length === 0 ? (
                        <div className="text-center py-4">
                          <IconWrapper icon={FaImages} className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                          <p className="text-muted">No gallery years found</p>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => {
                              setEditingYear(null);
                              setNewYear({ year: '', title: '', description: '', alt: '' });
                              setYearImage(null);
                              setYearImagePreview('');
                              setShowYearModal(true);
                            }}
                          >
                            <IconWrapper icon={FaPlus} className="me-1" />
                            Create First Year
                          </Button>
                        </div>
                      ) : (
                        <div className="row g-3">
                          {galleryYears.map(year => (
                            <div key={year.id} className="col-12">
                              <Card className="border-0 shadow-sm">
                                <Card.Body className="p-3">
                                  <div className="d-flex align-items-center">
                                    <div className="me-3">
                                      <img 
                                        src={year.image} 
                                        alt={year.alt || year.title}
                                        className="rounded"
                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                      />
                                    </div>
                                    <div className="flex-grow-1">
                                      <h6 className="mb-1 fw-bold">{year.title}</h6>
                                      <p className="mb-1 text-muted small">{year.year}</p>
                                      <span className={`badge ${year.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                        {year.isActive ? 'Active' : 'Inactive'}
                                      </span>
                                    </div>
                                    <div className="btn-group" role="group">
                                      <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => handleEditYear(year)}
                                        title="Edit Year"
                                      >
                                        <IconWrapper icon={FaPenToSquare} />
                                      </Button>
                                      <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => handleDeleteYear(year.id)}
                                        title="Delete Year"
                                      >
                                        <IconWrapper icon={FaTrash} />
                                      </Button>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col lg={6}>
                  <Card className="admin-stats-card h-100">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 fw-bold">
                        <IconWrapper icon={FaCalendarDay} className="me-2" />
                        Gallery Events
                      </h6>
                      <Button 
                        variant="success" 
                        size="sm" 
                        onClick={() => {
                          setEditingEvent(null);
                          setNewEvent({ year: '', name: '', description: '' });
                          setEventThumbnail(null);
                          setEventThumbnailPreview('');
                          setEventImages([]);
                          setEventImagesPreviews([]);
                          setExistingEventImages([]);
                          setShowEventModal(true);
                        }}
                      >
                        <IconWrapper icon={FaPlus} className="me-1" />
                        Add Event
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      {loading ? (
                        <div className="text-center py-4">
                          <Spinner animation="border" size="sm" />
                          <p className="mt-2 text-muted">Loading gallery events...</p>
                        </div>
                      ) : galleryEvents.length === 0 ? (
                        <div className="text-center py-4">
                          <IconWrapper icon={FaCalendarDay} className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                          <p className="text-muted">No gallery events found</p>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => {
                              setEditingEvent(null);
                              setNewEvent({ year: '', name: '', description: '' });
                              setEventThumbnail(null);
                              setEventThumbnailPreview('');
                              setEventImages([]);
                              setEventImagesPreviews([]);
                              setExistingEventImages([]);
                              setShowEventModal(true);
                            }}
                          >
                            <IconWrapper icon={FaPlus} className="me-1" />
                            Create First Event
                          </Button>
                        </div>
                      ) : (
                        <div className="row g-3">
                          {galleryEvents.map(event => (
                            <div key={event.id} className="col-12">
                              <Card className="border-0 shadow-sm">
                                <Card.Body className="p-3">
                                  <div className="d-flex align-items-center">
                                    <div className="me-3">
                                      <img 
                                        src={event.thumbnail} 
                                        alt={event.name}
                                        className="rounded"
                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                      />
                                    </div>
                                    <div className="flex-grow-1">
                                      <h6 className="mb-1 fw-bold">{event.name}</h6>
                                      <p className="mb-1 text-muted small">{event.year}</p>
                                      <span className="badge bg-info">
                                        {event.images?.length || 0} images
                                      </span>
                                    </div>
                                    <div className="btn-group" role="group">
                                      <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => handleEditEvent(event)}
                                        title="Edit Event"
                                      >
                                        <IconWrapper icon={FaPenToSquare} />
                                      </Button>
                                      <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => handleDeleteEvent(event.id)}
                                        title="Delete Event"
                                      >
                                        <IconWrapper icon={FaTrash} />
                                      </Button>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Year Modal */}
      <Modal show={showYearModal} onHide={() => setShowYearModal(false)} centered size="xl" dialogClassName="admin-modal">
        <Modal.Header closeButton className="admin-modal-header">
          <div className="d-flex align-items-center">
            <div className="admin-stats-icon admin-stats-primary me-3">
                             <IconWrapper icon={editingYear ? FaPenToSquare : FaPlus} />
            </div>
            <div>
              <Modal.Title className="fw-bold mb-1 text-white">
                {editingYear ? 'Edit Gallery Year' : 'Add New Gallery Year'}
              </Modal.Title>
              <p className="mb-0 opacity-90 text-white">
                {editingYear ? 'Update year information and image' : 'Create a new gallery year with image'}
              </p>
            </div>
          </div>
        </Modal.Header>
        <Form onSubmit={handleCreateYear}>
          <Modal.Body className="admin-modal-body">
            <Row>
              <Col lg={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Year</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 2025-2026"
                    value={newYear.year}
                    onChange={(e) => setNewYear({ ...newYear, year: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 2025-2026 Rotary Year"
                    value={newYear.title}
                    onChange={(e) => setNewYear({ ...newYear, title: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Brief description of the year and its significance"
                    value={newYear.description}
                    onChange={(e) => setNewYear({ ...newYear, description: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Alt Text</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Alt text for the image (for accessibility)"
                    value={newYear.alt}
                    onChange={(e) => setNewYear({ ...newYear, alt: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Year Image</Form.Label>
                  <div className="border rounded p-3 text-center">
                    {yearImagePreview ? (
                      <div className="mb-3">
                        <img 
                          src={yearImagePreview} 
                          alt="Preview" 
                          className="img-fluid rounded mb-2"
                          style={{ maxHeight: '200px' }}
                        />
                        <div className="d-flex gap-2 justify-content-center">
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={clearYearImage}
                          >
                            <IconWrapper icon={FaTrash} />
                          </Button>
                        </div>
                      </div>
                    ) : editingYear?.image ? (
                      <div className="mb-3">
                        <img 
                          src={editingYear.image} 
                          alt={editingYear.alt || editingYear.title}
                          className="img-fluid rounded mb-2"
                          style={{ maxHeight: '200px' }}
                        />
                        <p className="text-muted small">Current image</p>
                      </div>
                    ) : (
                      <div className="py-4">
                        <IconWrapper icon={FaImage} className="text-muted mb-2" style={{ fontSize: '3rem' }} />
                        <p className="text-muted small">No image selected</p>
                      </div>
                    )}
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleYearImageUpload}
                      required={!editingYear}
                    />
                    <small className="text-muted">
                      Recommended: 800x600px or larger
                    </small>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="admin-modal-footer d-flex justify-content-center">
            <div className="d-flex gap-3">
              <Button className="admin-btn admin-btn-outline" onClick={() => setShowYearModal(false)}>
                <IconWrapper icon={FaXmark} className="me-2" />
                Cancel
              </Button>
              <Button className="admin-btn admin-btn-primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {editingYear ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <IconWrapper icon={editingYear ? FaFloppyDisk : FaPlus} className="me-2" />
                    {editingYear ? 'Update Year' : 'Create Year'}
                  </>
                )}
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add/Edit Event Modal */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)} centered size="xl" dialogClassName="admin-modal">
        <Modal.Header closeButton className="admin-modal-header">
          <div className="d-flex align-items-center">
            <div className="admin-stats-icon admin-stats-primary me-3">
                             <IconWrapper icon={editingEvent ? FaPenToSquare : FaPlus} />
            </div>
            <div>
              <Modal.Title className="fw-bold mb-1 text-white">
                {editingEvent ? 'Edit Gallery Event' : 'Add New Gallery Event'}
              </Modal.Title>
              <p className="mb-0 opacity-90 text-white">
                {editingEvent ? 'Update event information and images' : 'Create a new gallery event with images'}
              </p>
            </div>
          </div>
        </Modal.Header>
        <Form onSubmit={handleCreateEvent}>
          <Modal.Body className="admin-modal-body">
            <Row>
              <Col lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Year</Form.Label>
                  <Form.Select
                    value={newEvent.year}
                    onChange={(e) => setNewEvent({ ...newEvent, year: e.target.value })}
                    required
                  >
                    <option value="">Select Year</option>
                    {galleryYears.filter(year => year.isActive).map(year => (
                      <option key={year.id} value={year.year}>
                        {year.year} - {year.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Event Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Installation Ceremony"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Brief description of the event"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Event Thumbnail</Form.Label>
                  <div className="border rounded p-3 text-center">
                    {eventThumbnailPreview ? (
                      <div className="mb-3">
                        <img 
                          src={eventThumbnailPreview} 
                          alt="Preview" 
                          className="img-fluid rounded mb-2"
                          style={{ maxHeight: '150px' }}
                        />
                        <div className="d-flex gap-2 justify-content-center">
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={clearEventThumbnail}
                          >
                            <IconWrapper icon={FaTrash} />
                          </Button>
                        </div>
                      </div>
                    ) : editingEvent?.thumbnail ? (
                      <div className="mb-3">
                        <img 
                          src={editingEvent.thumbnail} 
                          alt={editingEvent.name}
                          className="img-fluid rounded mb-2"
                          style={{ maxHeight: '150px' }}
                        />
                        <p className="text-muted small">Current thumbnail</p>
                      </div>
                    ) : (
                      <div className="py-3">
                        <IconWrapper icon={FaImage} className="text-muted mb-2" style={{ fontSize: '2rem' }} />
                        <p className="text-muted small">No thumbnail selected</p>
                      </div>
                    )}
                                         <Form.Control
                       type="file"
                       accept="image/*"
                       onChange={handleEventThumbnailUpload}
                     />
                    <small className="text-muted">
                      Recommended: 400x300px or larger
                    </small>
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Event Images</Form.Label>
                  
                  {/* Existing Images */}
                  {existingEventImages.length > 0 && (
                    <div className="mb-3">
                      <h6 className="mb-2">Existing Images</h6>
                      <div className="row g-2">
                        {existingEventImages.map((image) => (
                          <div key={image.id} className="col-4">
                            <div className="position-relative">
                              <img 
                                src={image.src} 
                                alt={image.alt}
                                className="img-fluid rounded"
                                style={{ height: '100px', width: '100%', objectFit: 'cover' }}
                              />
                              <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute top-0 end-0"
                                style={{ transform: 'translate(25%, -25%)' }}
                                onClick={() => removeExistingEventImage(image.id)}
                                title="Remove image"
                              >
                                                                 <IconWrapper icon={FaXmark} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images */}
                  <div className="border rounded p-3 text-center">
                    {eventImagesPreviews.length > 0 ? (
                      <div className="mb-3">
                        <div className="row g-2">
                          {eventImagesPreviews.map((preview, index) => (
                            <div key={index} className="col-4">
                              <img 
                                src={preview} 
                                alt={`Preview ${index + 1}`}
                                className="img-fluid rounded"
                                style={{ height: '100px', width: '100%', objectFit: 'cover' }}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="d-flex gap-2 justify-content-center">
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={clearEventImages}
                          >
                            <IconWrapper icon={FaTrash} />
                            Clear All
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-3">
                        <IconWrapper icon={FaImages} className="text-muted mb-2" style={{ fontSize: '2rem' }} />
                        <p className="text-muted small">No new images selected</p>
                      </div>
                    )}
                    <Form.Control
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleEventImagesUpload}
                      required={!editingEvent && existingEventImages.length === 0}
                    />
                    <small className="text-muted">
                      Select multiple images. Recommended: 1200x800px or larger
                    </small>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="admin-modal-footer d-flex justify-content-center">
            <div className="d-flex gap-3">
              <Button className="admin-btn admin-btn-outline" onClick={() => setShowEventModal(false)}>
                <IconWrapper icon={FaXmark} className="me-2" />
                Cancel
              </Button>
              <Button className="admin-btn admin-btn-primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {editingEvent ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <IconWrapper icon={editingEvent ? FaFloppyDisk : FaPlus} className="me-2" />
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </>
                )}
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

const Admin: React.FC = () => {
  usePageTitle('Admin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberStats, setMemberStats] = useState<MemberStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('active'); // New: status filter state
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null); // New: search timeout state
  
  // New: Cached data for client-side filtering
  const [cachedMembers, setCachedMembers] = useState<Member[]>([]);
  const [isDataCached, setIsDataCached] = useState(false);
  const [useClientSideFiltering, setUseClientSideFiltering] = useState(true);
  
  // Edit and Delete states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    classification: '',
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
    memberSince: new Date().getFullYear().toString(),
    // Additional member details
    profileImage: '',
    currentDesignation: '',
    profession: '',
    birthday: '',
    hobbies: '',
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
    },
    // Legacy fields
    pastPositions: [] as string[],
    isPastPresident: false,
    presidentialYears: [] as string[],
    familyMembers: [] as FamilyMember[]
  });
  const [addFormData, setAddFormData] = useState({
    name: '',
    email: '',
    classification: '',
    joinDate: new Date().toISOString().split('T')[0],
    memberSince: new Date().getFullYear().toString(),
    // Additional member details
    profileImage: '',
    currentDesignation: '',
    profession: '',
    birthday: '',
    hobbies: '',
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
    },
    // Legacy fields
    pastPositions: [] as string[],
    isPastPresident: false,
    presidentialYears: [] as string[],
    familyMembers: [] as FamilyMember[]
  });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [addError, setAddError] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  
  // Gallery state
  const [existingEventImages, setExistingEventImages] = useState<{ id: string; src: string; alt: string }[]>([]);

  // Family members management
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [editingFamilyMember, setEditingFamilyMember] = useState<FamilyMember | null>(null);
  const [familyFormData, setFamilyFormData] = useState({
    name: '',
    relationship: '',
    photo: '',
    profession: '',
    hobbies: '',
    birthday: '',
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

  // Photo upload states
  const [familyPhotoPreview, setFamilyPhotoPreview] = useState<string>('');
  const [memberPhotoPreview, setMemberPhotoPreview] = useState<string>('');
  
  // Photo state management per member
  const [currentMemberPhotoPreview, setCurrentMemberPhotoPreview] = useState<string>('');
  
  // Member search for family linking
  const [showMemberSearchModal, setShowMemberSearchModal] = useState(false);

  // Gallery management states
  const [galleryYears, setGalleryYears] = useState<GalleryYear[]>([]);
  const [galleryEvents, setGalleryEvents] = useState<GalleryEvent[]>([]);
  const [showYearModal, setShowYearModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingYear, setEditingYear] = useState<GalleryYear | null>(null);
  const [editingEvent, setEditingEvent] = useState<GalleryEvent | null>(null);

  
  // Form states for new year
  const [newYear, setNewYear] = useState({
    year: '',
    title: '',
    description: '',
    alt: ''
  });
  
  // Form states for new event
  const [newEvent, setNewEvent] = useState({
    year: '',
    name: '',
    description: '',
    images: [] as { src: string; alt: string }[]
  });
  
  // File upload states
  const [yearImage, setYearImage] = useState<File | null>(null);
  const [eventThumbnail, setEventThumbnail] = useState<File | null>(null);
  const [eventImages, setEventImages] = useState<File[]>([]);

  // Helper functions for family members
  const addFamilyMember = () => {
    setEditingFamilyMember(null);
    setFamilyFormData({
      name: '',
      relationship: '',
      photo: '',
      profession: '',
      hobbies: '',
      birthday: '',
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
    setShowFamilyModal(true);
  };

  const editFamilyMember = (familyMember: FamilyMember) => {
    setEditingFamilyMember(familyMember);
    setFamilyFormData({
      name: familyMember.name,
      relationship: familyMember.relationship,
      photo: familyMember.photo || '',
      profession: familyMember.profession || '',
      hobbies: familyMember.hobbies || '',
      birthday: familyMember.birthday || '',
      personalBio: familyMember.personalBio || '',
      personalDetails: {
        address: familyMember.personalDetails?.address || '',
        phone: familyMember.personalDetails?.phone || '',
        education: familyMember.personalDetails?.education || '',
        achievements: familyMember.personalDetails?.achievements || '',
        interests: familyMember.personalDetails?.interests || '',
        socialMedia: {
          linkedin: familyMember.personalDetails?.socialMedia?.linkedin || '',
          facebook: familyMember.personalDetails?.socialMedia?.facebook || '',
          twitter: familyMember.personalDetails?.socialMedia?.twitter || ''
        }
      }
    });
    setShowFamilyModal(true);
  };

  const saveFamilyMember = () => {
    if (editingFamilyMember) {
      // Update existing family member
      setFamilyMembers(prev => prev.map(fm => 
        fm.id === editingFamilyMember.id ? { ...familyFormData, id: fm.id } : fm
      ));
    } else {
      // Add new family member
      const newFamilyMember: FamilyMember = {
        ...familyFormData,
        id: Date.now().toString() // Simple ID generation
      };
      setFamilyMembers(prev => [...prev, newFamilyMember]);
    }
    setShowFamilyModal(false);
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(fm => fm.id !== id));
  };

  // Photo upload handlers
  const handleFamilyPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFamilyPhotoPreview(result);
        setFamilyFormData(prev => ({ ...prev, photo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMemberPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setMemberPhotoPreview(result);
        setCurrentMemberPhotoPreview(result);
        setEditFormData(prev => ({ ...prev, profileImage: result }));
        setAddFormData(prev => ({ ...prev, profileImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFamilyPhoto = () => {
    setFamilyPhotoPreview('');
    setFamilyFormData(prev => ({ ...prev, photo: '' }));
  };

  const clearMemberPhoto = () => {
    setMemberPhotoPreview('');
    setCurrentMemberPhotoPreview('');
    setEditFormData(prev => ({ ...prev, profileImage: '' }));
    setAddFormData(prev => ({ ...prev, profileImage: '' }));
  };

  // Member search functions for family linking
  const linkMemberAsFamily = async (member: Member, relationship: string) => {
    try {
      // Get the current member ID from the editing member
      const currentMemberId = editingMember?._id || editingMember?.id;
      
      if (!currentMemberId) {
        // Fallback to local state update if we can't get the member ID
        const newFamilyMember: FamilyMember = {
          id: `family-${Date.now()}`,
          name: member.name,
          relationship: relationship,
          photo: member.profileImage,
          profession: member.profession,
          hobbies: member.hobbies,
          birthday: member.birthday,
          personalBio: member.personalBio,
          personalDetails: member.personalDetails,
          memberId: member.id || member._id,
          isMember: true
        };
        setFamilyMembers(prev => [...prev, newFamilyMember]);
        return;
      }

      // Use the new API endpoint to create bidirectional relationship
      const memberToken = localStorage.getItem('memberToken');
      const adminToken = localStorage.getItem('adminToken');
      const token = memberToken || adminToken;
      
      const requestBody = {
        targetMemberId: member.id || member._id,
        relationship: relationship
      };
      
      const response = await fetch(`${API_BASE_URL}/members/${currentMemberId}/family/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to link family member');
      }

      await response.json();

      // Update local state with the new family member
      const newFamilyMember: FamilyMember = {
        id: `family-${Date.now()}`,
        name: member.name,
        relationship: relationship,
        photo: member.profileImage,
        profession: member.profession,
        hobbies: member.hobbies,
        birthday: member.birthday,
        personalBio: member.personalBio,
        personalDetails: member.personalDetails,
        memberId: member.id || member._id,
        isMember: true
      };

      setFamilyMembers(prev => [...prev, newFamilyMember]);



      // Show success message
      alert(`Successfully linked ${member.name} as ${relationship.toLowerCase()}. The relationship has been created in both profiles.`);
    } catch (error) {
      console.error('Error linking family member:', error);
      alert('Failed to link family member. Please try again.');
    }
  };

  // Add event listener for opening member search modal
  useEffect(() => {
    const handleOpenMemberSearch = () => {
      setShowMemberSearchModal(true);
    };

    window.addEventListener('openMemberSearch', handleOpenMemberSearch);
    
    return () => {
      window.removeEventListener('openMemberSearch', handleOpenMemberSearch);
    };
  }, []);
  

  
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

  // Helper functions for client-side filtering
  const filterMembersClientSide = useCallback((allMembers: Member[], search: string, status: string, sortBy: string, sortOrder: string): Member[] => {
    let filtered = allMembers;
    
    // Apply status filter
    if (status === 'active') {
      filtered = filtered.filter(member => member.isActive && member.status === 'active');
    } else if (status === 'inactive') {
      filtered = filtered.filter(member => !member.isActive || member.status !== 'active');
    }
    // If status is 'all', include all members
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        (member.classification && member.classification.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'createdAt':
          aValue = a.createdAt || '';
          bValue = b.createdAt || '';
          break;
        case 'lastLogin':
          aValue = a.lastLogin || '';
          bValue = b.lastLogin || '';
          break;
        default:
          aValue = a.createdAt || '';
          bValue = b.createdAt || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
    
    return filtered;
  }, []);

  const paginateMembers = useCallback((members: Member[], page: number, limit: number): Member[] => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return members.slice(startIndex, endIndex);
  }, []);

  const calculateMemberStats = useCallback((members: Member[]): MemberStatistics => {
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.isActive && m.status === 'active').length;
    const membersWithLogin = members.filter(m => m.hasLoggedIn).length;
    const recentLogins = members.filter(m => {
      if (!m.lastLogin) return false;
      const daysSinceLogin = m.daysSinceLastLogin;
      return daysSinceLogin !== null && daysSinceLogin !== undefined && daysSinceLogin <= 7;
    }).length;
    
    return {
      totalMembers,
      activeMembers,
      membersWithLogin,
      recentLogins,
      loginRate: totalMembers > 0 ? Math.round((membersWithLogin / totalMembers) * 100) : 0
    };
  }, []);

  // New: Separate function for client-side filtering updates
  const updateClientSideFiltering = useCallback(() => {
    if (useClientSideFiltering && isDataCached && cachedMembers.length > 0) {
      const filteredMembers = filterMembersClientSide(cachedMembers, searchTerm, statusFilter, sortBy, sortOrder);
      const paginatedMembers = paginateMembers(filteredMembers, currentPage, 20);
      
      setMembers(paginatedMembers);
      setTotalPages(Math.ceil(filteredMembers.length / 20));
      
      // Calculate stats from filtered data
      const memberStats = calculateMemberStats(filteredMembers);
      setMemberStats(memberStats);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useClientSideFiltering, isDataCached, cachedMembers.length, searchTerm, statusFilter, sortBy, sortOrder, currentPage, filterMembersClientSide, paginateMembers, calculateMemberStats, setMembers, setTotalPages, setMemberStats]);

  const loadDashboardData = useCallback(async () => {
    try {
      const memberToken = localStorage.getItem('memberToken');
      const adminToken = localStorage.getItem('adminToken');
      const token = memberToken || adminToken;
      
      // Load dashboard stats
      const statsResponse = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.statistics);
      } else {
        const errorText = await statsResponse.text();
        console.error('Dashboard stats error:', errorText);
      }

      // Load members - use client-side filtering if enabled
      if (useClientSideFiltering && isDataCached && cachedMembers.length > 0) {
        // Use cached data for client-side filtering
        updateClientSideFiltering();
        setLoading(false);
        return;
      }
      
      // Fetch from server (with or without filters based on approach)
      const queryParams = useClientSideFiltering 
        ? '?limit=1000' // Get all data for caching
        : `?page=${currentPage}&limit=20&sortBy=${sortBy}&sortOrder=${sortOrder}&status=${statusFilter}`;
        
      const membersResponse = await fetch(`${API_BASE_URL}/admin/members/all${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (membersResponse.ok) {
        const membersData = await membersResponse.json();
        
        if (useClientSideFiltering) {
          // Cache all data for client-side filtering
          setCachedMembers(membersData.members || []);
          setIsDataCached(true);
          
          // Apply client-side filtering
          const filteredMembers = filterMembersClientSide(membersData.members || [], searchTerm, statusFilter, sortBy, sortOrder);
          const paginatedMembers = paginateMembers(filteredMembers, currentPage, 20);
          
          setMembers(paginatedMembers);
          setTotalPages(Math.ceil(filteredMembers.length / 20));
          
          // Calculate stats from filtered data
          const memberStats = calculateMemberStats(filteredMembers);
          setMemberStats(memberStats);
        } else {
          // Use server-side filtering
          setMembers(membersData.members || []);
          setMemberStats(membersData.statistics);
          setTotalPages(membersData.pagination.pages);
        }
      } else {
        const errorText = await membersResponse.text();
        console.error('Members error:', errorText);
      }

      setLoading(false);
    } catch (error) {
      console.error('Dashboard load error:', error);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE_URL, useClientSideFiltering, isDataCached, cachedMembers, currentPage, searchTerm, statusFilter, sortBy, sortOrder, updateClientSideFiltering, filterMembersClientSide, paginateMembers, calculateMemberStats, setMembers, setTotalPages, setMemberStats, setCachedMembers, setIsDataCached, setStats, setLoading, setError]);

  const checkAuth = useCallback(async () => {
    const memberToken = localStorage.getItem('memberToken');
    const adminToken = localStorage.getItem('adminToken');
    
    if (!memberToken && !adminToken) {
      setLoading(false);
      return;
    }

    try {
      let response;
      let data;
      
      if (memberToken) {
        // Check member authentication
        response = await fetch(`${API_BASE_URL}/auth/member-me`, {
          headers: {
            'Authorization': `Bearer ${memberToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          data = await response.json();
          const memberData = data.member;
          
          // Check if member has admin privileges
          if (memberData.isAdmin) {
            setMember(memberData);
            setUser({
              _id: memberData.id,
              username: memberData.name,
              email: memberData.email,
              role: 'admin',
              profile: {
                firstName: memberData.name.split(' ')[0],
                lastName: memberData.name.split(' ').slice(1).join(' ')
              }
            });
            setIsAuthenticated(true);
            // Call loadDashboardData directly instead of including it in dependencies
            // This prevents circular dependency issues
            setTimeout(() => {
              loadDashboardData();
            }, 0);
          } else {
            // Member doesn't have admin privileges
            localStorage.removeItem('memberToken');
            setLoading(false);
            navigate('/auth');
          }
        } else {
          localStorage.removeItem('memberToken');
          setLoading(false);
          navigate('/auth');
        }
      } else if (adminToken) {
        // Legacy admin authentication
        response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
          // Call loadDashboardData directly instead of including it in dependencies
          // This prevents circular dependency issues
          setTimeout(() => {
            loadDashboardData();
          }, 0);
        } else {
          localStorage.removeItem('adminToken');
          setLoading(false);
          navigate('/auth');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('memberToken');
      localStorage.removeItem('adminToken');
      setLoading(false);
      navigate('/auth');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE_URL, navigate, setMember, setUser, setIsAuthenticated, setLoading]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Modal size management - removed manual DOM manipulation

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;



    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        loadDashboardData();
      } else {
        const errorData = await response.json();
        console.error('❌ Login failed:', errorData);
        setError(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUser(null);
    setMember(null);
    setStats(null);
    setMembers([]);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    
    if (useClientSideFiltering && isDataCached && cachedMembers.length > 0) {
      // Instant client-side filtering
      updateClientSideFiltering();
    } else {
      // Server-side filtering with debouncing
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      
      const timeout = setTimeout(() => {
        loadDashboardData();
      }, 500);
      
      setSearchTimeout(timeout);
    }
  };

  // New: Handle status filter change
  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
    
    if (useClientSideFiltering && isDataCached && cachedMembers.length > 0) {
      // Instant client-side filtering
      updateClientSideFiltering();
    } else {
      // Server-side filtering with debouncing
      setTimeout(() => {
        loadDashboardData();
      }, 300);
    }
  };

  // New: Handle sort change
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
    
    if (useClientSideFiltering && isDataCached && cachedMembers.length > 0) {
      // Instant client-side sorting
      updateClientSideFiltering();
    } else {
      // Server-side sorting
      loadDashboardData();
    }
  };

  // Edit and Delete handlers
  const handleEditClick = (member: Member) => {
    setEditingMember(member);
    
    // Format join date for HTML date input (YYYY-MM-DD)
    let formattedJoinDate = '';
    if (member.joinDate) {
      try {
        const date = new Date(member.joinDate);
        if (!isNaN(date.getTime())) {
          formattedJoinDate = date.toISOString().split('T')[0];
        }
      } catch (error) {
        console.error('Error formatting join date:', error);
      }
    }
    
    setEditFormData({
      name: member.name,
      email: member.email,
      classification: member.classification,
      status: member.status,
      joinDate: formattedJoinDate || new Date().toISOString().split('T')[0],
      memberSince: member.memberSince || new Date().getFullYear().toString(),
      // Additional member details
      profileImage: member.profileImage || '',
      currentDesignation: member.currentDesignation || '',
      profession: member.profession || '',
      birthday: member.birthday || '',
      hobbies: member.hobbies || '',
      personalBio: member.personalBio || '',
      personalDetails: {
        address: member.personalDetails?.address || '',
        phone: member.personalDetails?.phone || '',
        education: member.personalDetails?.education || '',
        achievements: member.personalDetails?.achievements || '',
        interests: member.personalDetails?.interests || '',
        socialMedia: {
          linkedin: member.personalDetails?.socialMedia?.linkedin || '',
          facebook: member.personalDetails?.socialMedia?.facebook || '',
          twitter: member.personalDetails?.socialMedia?.twitter || ''
        }
      },
      // Legacy fields
      pastPositions: member.pastPositions || [],
      isPastPresident: member.isPastPresident || false,
      presidentialYears: member.presidentialYears || [],
      familyMembers: member.familyMembers || []
    });
    setFamilyMembers(member.familyMembers || []); // Set family members for editing
    
    // Set photo preview for current member
    setCurrentMemberPhotoPreview(member.profileImage || '');
    setMemberPhotoPreview(member.profileImage || '');
    
    setEditError('');
    setShowEditModal(true);
  };

  const handleDeleteClick = (member: Member) => {
    setDeletingMember(member);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEditLoading(true);
    setEditError('');

    try {
      const memberToken = localStorage.getItem('memberToken');
      const adminToken = localStorage.getItem('adminToken');
      const token = memberToken || adminToken;
      
      const updatedData = {
        ...editFormData,
        familyMembers: familyMembers // Include family members in the update
      };

      const response = await fetch(`${API_BASE_URL}/members/${editingMember?.id || editingMember?._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const data = await response.json();

        
        // Update the member in the local state
        const updatedMember = data.member;
        const memberWithCorrectId = {
          ...updatedMember,
          _id: updatedMember.id || updatedMember._id
        };
        
        // Use the original editing member's ID to find and update the correct member
        const originalMemberId = editingMember?._id || editingMember?.id;
        
        setMembers(prevMembers => prevMembers.map(member => {
          const memberId = member._id || member.id;
          return memberId === originalMemberId ? memberWithCorrectId : member;
        }));
        
        setShowEditModal(false);
        setEditingMember(null);
        setEditFormData({ name: '', email: '', classification: '', status: 'active', joinDate: new Date().toISOString().split('T')[0], memberSince: new Date().getFullYear().toString(), profileImage: '', currentDesignation: '', profession: '', birthday: '', hobbies: '', personalBio: '', personalDetails: { address: '', phone: '', education: '', achievements: '', interests: '', socialMedia: { linkedin: '', facebook: '', twitter: '' } }, pastPositions: [], isPastPresident: false, presidentialYears: [], familyMembers: [] });
        setFamilyMembers([]);
      } else {
        const errorData = await response.json();
        console.error('❌ Update failed:', errorData);
        setEditError(errorData.message || 'Failed to update member');
      }
    } catch (error) {
      console.error('Update error:', error);
      setEditError('Failed to update member. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMember) return;

    setDeleteLoading(true);
    setDeleteError('');

    try {
      const memberToken = localStorage.getItem('memberToken');
      const adminToken = localStorage.getItem('adminToken');
      const token = memberToken || adminToken;
      
      const response = await fetch(`${API_BASE_URL}/members/${deletingMember.id || deletingMember._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {

        
        // Remove the member from the local state
        setMembers(prevMembers => 
          prevMembers.filter(member => 
            member._id !== deletingMember._id && member.id !== deletingMember.id
          )
        );
        
        setShowDeleteModal(false);
        setDeletingMember(null);
      } else {
        const errorData = await response.json();
        console.error('❌ Delete failed:', errorData);
        setDeleteError(errorData.message || 'Failed to delete member');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setDeleteError('Failed to delete member. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // New: Status toggle functionality
  const handleStatusToggle = async (member: Member) => {
    try {
      const memberToken = localStorage.getItem('memberToken');
      const adminToken = localStorage.getItem('adminToken');
      const token = memberToken || adminToken;
      
      const newStatus = member.status === 'active' ? 'inactive' : 'active';
      const newIsActive = !member.isActive;
      
      const response = await fetch(`${API_BASE_URL}/members/${member.id || member._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          isActive: newIsActive
        })
      });

      if (response.ok) {

        
        // Update the member in the local state
        setMembers(prevMembers => prevMembers.map(m => {
          const memberId = m._id || m.id;
          const targetId = member._id || member.id;
          if (memberId === targetId) {
            return {
              ...m,
              status: newStatus,
              isActive: newIsActive
            };
          }
          return m;
        }));
      } else {
        const errorData = await response.json();
        console.error('❌ Status update failed:', errorData);
        alert(errorData.message || 'Failed to update member status');
      }
    } catch (error) {
      console.error('Status toggle error:', error);
      alert('Failed to update member status. Please try again.');
    }
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditingMember(null);
            setEditFormData({ name: '', email: '', classification: '', status: 'active', joinDate: new Date().toISOString().split('T')[0], memberSince: new Date().getFullYear().toString(), profileImage: '', currentDesignation: '', profession: '', birthday: '', hobbies: '', personalBio: '', personalDetails: { address: '', phone: '', education: '', achievements: '', interests: '', socialMedia: { linkedin: '', facebook: '', twitter: '' } }, pastPositions: [], isPastPresident: false, presidentialYears: [], familyMembers: [] });
    setFamilyMembers([]);
    
    // Clear photo state
    setCurrentMemberPhotoPreview('');
    setMemberPhotoPreview('');
    
    setEditError('');
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeletingMember(null);
    setDeleteError('');
  };

  const handleAddClick = () => {
    setAddFormData({
      name: '',
      email: '',
      classification: '',
      joinDate: new Date().toISOString().split('T')[0],
      memberSince: new Date().getFullYear().toString(),
      // Additional member details
      profileImage: '',
      currentDesignation: '',
      profession: '',
      birthday: '',
      hobbies: '',
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
      },
      // Legacy fields

      pastPositions: [],
      isPastPresident: false,
      presidentialYears: [],
      familyMembers: []
    });
    setFamilyMembers([]); // Clear family members for new member
    
    // Clear photo state for new member
    setCurrentMemberPhotoPreview('');
    setMemberPhotoPreview('');
    
    setAddError('');
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setAddLoading(true);
    setAddError('');

    try {
      const memberToken = localStorage.getItem('memberToken');
      const adminToken = localStorage.getItem('adminToken');
      const token = memberToken || adminToken;
      
      // Ensure all required fields are present
      const newData = {
        ...addFormData,
        familyMembers: familyMembers, // Include family members in the new member
        joinDate: addFormData.joinDate || new Date().toISOString().split('T')[0],
        memberSince: addFormData.memberSince || new Date().getFullYear().toString(),
        classification: addFormData.classification || 'Member',
        status: 'active',
        isActive: true
      };

      const response = await fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
      });

      if (response.ok) {
        const data = await response.json();

        
        // Add the new member to the local state
        // The backend returns { message: 'Member created successfully', member: {...} }
        const newMember = data.member;
        // Map the backend 'id' field to frontend '_id' field for consistency
        const memberWithCorrectId = {
          ...newMember,
          _id: newMember.id || newMember._id
        };
        setMembers(prevMembers => [memberWithCorrectId, ...prevMembers]);
        
        setShowAddModal(false);
        setAddFormData({ name: '', email: '', classification: '', joinDate: new Date().toISOString().split('T')[0], memberSince: new Date().getFullYear().toString(), profileImage: '', currentDesignation: '', profession: '', birthday: '', hobbies: '', personalBio: '', personalDetails: { address: '', phone: '', education: '', achievements: '', interests: '', socialMedia: { linkedin: '', facebook: '', twitter: '' } }, pastPositions: [], isPastPresident: false, presidentialYears: [], familyMembers: [] });
        setFamilyMembers([]);
      } else {
        const errorData = await response.json();
        console.error('❌ Add failed:', errorData);
        setAddError(errorData.message || 'Failed to add member');
      }
    } catch (error) {
      console.error('Add error:', error);
      setAddError('Failed to add member. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleAddCancel = () => {
    setShowAddModal(false);
    setAddFormData({ name: '', email: '', classification: '', joinDate: new Date().toISOString().split('T')[0], memberSince: new Date().getFullYear().toString(), profileImage: '', currentDesignation: '', profession: '', birthday: '', hobbies: '', personalBio: '', personalDetails: { address: '', phone: '', education: '', achievements: '', interests: '', socialMedia: { linkedin: '', facebook: '', twitter: '' } }, pastPositions: [], isPastPresident: false, presidentialYears: [], familyMembers: [] });
    setFamilyMembers([]);
    
    // Clear photo state
    setCurrentMemberPhotoPreview('');
    setMemberPhotoPreview('');
    
    setAddError('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="admin-badge bg-success px-3 py-2">Active</Badge>;
      case 'inactive':
        return <Badge className="admin-badge bg-secondary px-3 py-2">Inactive</Badge>;
      default:
        return <Badge className="admin-badge bg-warning px-3 py-2">Unknown</Badge>;
    }
  };

  const getLoginStatusBadge = (member: Member) => {
    if (!member.hasLoggedIn) {
      return <Badge className="admin-badge bg-danger px-3 py-2">Never Logged In</Badge>;
    }
    if (member.daysSinceLastLogin === 0) {
      return <Badge className="admin-badge bg-success px-3 py-2">Today</Badge>;
    }
    if (member.daysSinceLastLogin && member.daysSinceLastLogin <= 7) {
      return <Badge className="admin-badge bg-info px-3 py-2">{member.lastLoginText}</Badge>;
    }
    return <Badge className="admin-badge bg-warning px-3 py-2">{member.lastLoginText}</Badge>;
  };

  // Calculate dashboard stats from members data
  const calculateDashboardStats = (members: Member[]) => {
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.status === 'active').length;
    const currentDirectors = members.filter(m => m.currentDesignation && m.currentDesignation.trim() !== '').length;
    const pastPresidents = members.filter(m => m.isPastPresident).length;
    const membersWithLogin = members.filter(m => m.hasLoggedIn).length;
    const recentLogins = members.filter(m => m.daysSinceLastLogin !== undefined && m.daysSinceLastLogin <= 7).length;
    const loginRate = totalMembers > 0 ? Math.round((membersWithLogin / totalMembers) * 100) : 0;

    return {
      members: {
        total: totalMembers,
        active: activeMembers,
        currentDirectors: currentDirectors,
        pastPresidents: pastPresidents
      },
      memberStats: {
        totalMembers,
        activeMembers,
        membersWithLogin,
        recentLogins,
        loginRate
      }
    };
  };

  // New: Handle pagination change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    
    if (useClientSideFiltering && isDataCached && cachedMembers.length > 0) {
      // Instant client-side pagination
      updateClientSideFiltering();
    } else {
      // Server-side pagination
      loadDashboardData();
    }
  };

  // New: Handle search input change for real-time filtering
  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
    
    if (useClientSideFiltering && isDataCached && cachedMembers.length > 0) {
      // Instant client-side filtering on input change
      updateClientSideFiltering();
    }
  };

  // Effect to handle client-side filtering updates
  useEffect(() => {
    if (useClientSideFiltering && isDataCached && cachedMembers.length > 0) {
      updateClientSideFiltering();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useClientSideFiltering, isDataCached, cachedMembers.length]);

  // Effect to load data when component mounts or when switching modes
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeTab === 'gallery') {
      fetchGalleryData();
    }
  }, [activeTab]);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      
      const memberToken = localStorage.getItem('memberToken');
      const adminToken = localStorage.getItem('adminToken');
      const token = memberToken || adminToken;
      
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      
      // Fetch years
      const yearsResponse = await fetch(`${API_BASE_URL}/gallery/admin/years`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (yearsResponse.ok) {
        const yearsData = await yearsResponse.json();
        setGalleryYears(yearsData.years);
      }
      
      // Fetch events
      const eventsResponse = await fetch(`${API_BASE_URL}/gallery/admin/events`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setGalleryEvents(eventsData.events);
      }
    } catch (err) {
      console.error('Error fetching gallery data:', err);
      setError('Failed to load gallery data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      console.log('Creating/updating gallery year with data:', {
        newYear,
        yearImage: yearImage ? yearImage.name : 'No image',
        editingYear: editingYear?.id
      });
      
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('year', newYear.year);
      formData.append('title', newYear.title);
      formData.append('description', newYear.description);
      formData.append('alt', newYear.alt || '');
      
      // Add image file if selected
      if (yearImage) {
        formData.append('image', yearImage);
      }
      
      const memberToken = localStorage.getItem('memberToken');
      const adminToken = localStorage.getItem('adminToken');
      const token = memberToken || adminToken;
      
      const url = editingYear 
        ? `${API_BASE_URL}/gallery/years/${editingYear.id}`
        : `${API_BASE_URL}/gallery/years`;
      const method = editingYear ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Success response:', data);
        setSuccess(editingYear ? 'Gallery year updated successfully!' : 'Gallery year created successfully!');
        setShowYearModal(false);
        setNewYear({ year: '', title: '', description: '', alt: '' });
        setYearImage(null);
        setEditingYear(null);
        fetchGalleryData();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setError(errorData.message || (editingYear ? 'Failed to update gallery year' : 'Failed to create gallery year'));
      }
    } catch (err) {
      console.error('Exception during gallery year operation:', err);
      setError(editingYear ? 'Failed to update gallery year' : 'Failed to create gallery year');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('year', newEvent.year);
      formData.append('name', newEvent.name);
      formData.append('description', newEvent.description);
      

      
      // Add thumbnail if selected
      if (eventThumbnail) {
        formData.append('thumbnail', eventThumbnail);
      }
      
      // Add event images if selected
      if (eventImages && eventImages.length > 0) {
        eventImages.forEach((image, index) => {
          formData.append('images', image);
        });
      }

      // Add existing images that weren't removed
      if (existingEventImages && existingEventImages.length > 0) {
        formData.append('existingImages', JSON.stringify(existingEventImages));
      }
      
      const memberToken = localStorage.getItem('memberToken');
      const adminToken = localStorage.getItem('adminToken');
      const token = memberToken || adminToken;
      
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      let url = `${API_BASE_URL}/gallery/events`;
      let method = 'POST';
      
      // If editing an existing event, use PUT method
      if (editingEvent) {
        url = `${API_BASE_URL}/gallery/events/${editingEvent.id}`;
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        setSuccess(editingEvent ? 'Gallery event updated successfully!' : 'Gallery event created successfully!');
        setShowEventModal(false);
        setNewEvent({
          year: '',
          name: '',
          description: '',
          images: []
        });
        setEventThumbnail(null);
        setEventImages([]);
        setExistingEventImages([]);
        setEditingEvent(null);
        fetchGalleryData();
      } else {
        const errorData = await response.json();
        setError(errorData.message || (editingEvent ? 'Failed to update gallery event' : 'Failed to create gallery event'));
      }
    } catch (err) {
      setError(editingEvent ? 'Failed to update gallery event' : 'Failed to create gallery event');
    } finally {
      setLoading(false);
    }
  };

  // These functions are currently unused but may be needed for future gallery event management
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addImageField = () => {
    setNewEvent(prev => ({
      ...prev,
      images: [...prev.images, { src: '', alt: '' }]
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeImageField = (index: number) => {
    setNewEvent(prev => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index)
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateImageField = (index: number, field: 'src' | 'alt', value: string) => {
    setNewEvent(prev => ({
      ...prev,
      images: prev.images.map((img: any, i: number) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const handleEditYear = (year: GalleryYear) => {
    setEditingYear(year);
    setNewYear({
      year: year.year,
      title: year.title,
      description: year.description,
      alt: year.alt || ''
    });
    setYearImage(null);
    setShowYearModal(true);
  };

  const handleDeleteYear = async (yearId: string) => {
    if (!window.confirm('Are you sure you want to delete this gallery year?')) return;
    
    try {
      setLoading(true);
      setError(null);
      const memberToken = localStorage.getItem('memberToken');
      const adminToken = localStorage.getItem('adminToken');
      const token = memberToken || adminToken;
      
      console.log('Deleting year:', yearId);
      console.log('Using token:', token ? 'Token exists' : 'No token');
      
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${API_BASE_URL}/gallery/years/${yearId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Delete response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Delete success:', data);
        setSuccess('Gallery year deleted successfully!');
        fetchGalleryData();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Delete failed:', errorData);
        setError(`Failed to delete gallery year: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Delete exception:', err);
      setError(`Failed to delete gallery year: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (event: GalleryEvent) => {
    setEditingEvent(event);
    setNewEvent({
      year: event.year,
      name: event.name,
      description: event.description,
      images: event.images || []
    });
    setEventThumbnail(null);
    setEventImages([]);
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      setLoading(true);
      setError(null);
      const memberToken = localStorage.getItem('memberToken');
      const adminToken = localStorage.getItem('adminToken');
      const token = memberToken || adminToken;
      
      console.log('Deleting event:', eventId);
      console.log('Using token:', token ? 'Token exists' : 'No token');
      
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${API_BASE_URL}/gallery/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Delete response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Delete success:', data);
        setSuccess('Event deleted successfully!');
        fetchGalleryData();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Delete failed:', errorData);
        setError(`Failed to delete event: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Delete exception:', err);
      setError(`Failed to delete event: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-modern d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 200px)', paddingTop: '6rem' }}>
        <div className="text-center">
          <div className="admin-stats-icon admin-stats-primary mx-auto mb-4">
            <IconWrapper icon={FaGear} />
          </div>
          <Spinner animation="border" className="admin-spinner" />
          <p className="mt-4 text-white fw-semibold">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-modern d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 200px)', paddingTop: '6rem' }}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} sm={10} md={8} lg={6} xl={5}>
              <Card className="admin-login-container border-0">
                <Card.Header className="admin-login-header">
                  <div className="mb-4">
                    <div className="admin-stats-icon admin-stats-primary mx-auto">
                      <IconWrapper icon={FaGear} />
                    </div>
                  </div>
                  <h3 className="mb-2 fw-bold">Admin Portal</h3>
                  <p className="mb-0 opacity-90">Rotary Club of Cochin Lakeside</p>
                </Card.Header>
                <Card.Body className="admin-login-body">
                  {error && <Alert variant="danger" className="border-0 shadow-sm mb-4">{error}</Alert>}
                  
                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-dark mb-3">
                        <IconWrapper icon={FaEnvelope} className="me-2" style={{ color: '#667eea' }} />
                        Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        required
                        placeholder="Enter admin email"
                        className="admin-form-control"
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-dark mb-3">
                        <IconWrapper icon={FaGear} className="me-2" style={{ color: '#667eea' }} />
                        Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        required
                        placeholder="Enter admin password"
                        className="admin-form-control"
                      />
                    </Form.Group>
                    <Button 
                      type="submit" 
                      className="admin-btn admin-btn-primary w-100 mb-4"
                    >
                      <IconWrapper icon={FaGear} className="me-2" />
                      Admin Login
                    </Button>
                    <div className="text-center">
                      <Button 
                        variant="link" 
                        className="p-0 text-decoration-none admin-text-gradient"
                        onClick={() => window.location.href = '/auth'}
                      >
                        Member Login
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="admin-modern">
      <Container fluid>
        <Row>
          <Col>
            {/* Header */}
            <div className="admin-header">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="flex-grow-1">
                  <h2 className="fw-bold admin-text-gradient mb-2">
                    <IconWrapper icon={FaGear} className="me-3" />
                    <span className="d-none d-sm-inline">Admin Dashboard</span>
                    <span className="d-inline d-sm-none">Admin</span>
                  </h2>
                  <p className="text-white mb-0 opacity-90">
                    Welcome back, {member?.name || user?.profile?.firstName || user?.username}!
                  </p>
                </div>
                <div className="mt-3 mt-sm-0">
                  <Button 
                    className="admin-btn admin-btn-outline"
                    onClick={handleLogout}
                    size="sm"
                  >
                    <IconWrapper icon={FaRightFromBracket} className="me-2" />
                    <span className="d-none d-sm-inline">Logout</span>
                    <span className="d-inline d-sm-none">Logout</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <Card className="admin-nav mb-4">
              <Card.Body className="p-0">
                <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'dashboard')} className="border-0 flex-wrap">
                  <Nav.Item className="flex-fill">
                    <Nav.Link eventKey="dashboard" className="admin-nav-link">
                      <IconWrapper icon={FaChartBar} className="me-2" />
                      <span className="d-none d-md-inline">Dashboard</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="flex-fill">
                    <Nav.Link eventKey="members" className="admin-nav-link">
                      <IconWrapper icon={FaUsers} className="me-2" />
                      <span className="d-none d-md-inline">Members</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="flex-fill">
                    <Nav.Link eventKey="services" className="admin-nav-link">
                      <IconWrapper icon={FaBriefcase} className="me-2" />
                      <span className="d-none d-md-inline">Services</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="flex-fill">
                    <Nav.Link eventKey="gallery" className="admin-nav-link">
                      <IconWrapper icon={FaCamera} className="me-2" />
                      <span className="d-none d-md-inline">Gallery</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="flex-fill">
                    <Nav.Link eventKey="settings" className="admin-nav-link">
                      <IconWrapper icon={FaGear} className="me-2" />
                      <span className="d-none d-md-inline">Settings</span>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>

            {/* Content */}
            <div className="admin-main">
              <div className="p-3 p-md-4">
                {activeTab === 'dashboard' && (
                  <DashboardTab 
                    stats={stats} 
                    memberStats={memberStats} 
                    calculatedStats={calculateDashboardStats(members)}
                  />
                )}
                {activeTab === 'members' && (
                  <MembersTab 
                    members={members} 
                    memberStats={memberStats}
                    searchTerm={searchTerm}
                    setSearchTerm={handleSearchInputChange}
                    currentPage={currentPage}
                    setCurrentPage={handlePageChange}
                    totalPages={totalPages}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    statusFilter={statusFilter}
                    onSearch={handleSearch}
                    onSort={handleSort}
                    onStatusFilterChange={handleStatusFilterChange}
                    onStatusToggle={handleStatusToggle}
                    getStatusBadge={getStatusBadge}
                    getLoginStatusBadge={getLoginStatusBadge}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onAdd={handleAddClick}
                    useClientSideFiltering={useClientSideFiltering}
                    setUseClientSideFiltering={setUseClientSideFiltering}
                  />
                )}
                {activeTab === 'services' && (
                  <ServicesTab />
                )}
                {activeTab === 'gallery' && (
                  <GalleryTab 
                    galleryYears={galleryYears}
                    galleryEvents={galleryEvents}
                    loading={loading}
                    error={error}
                    success={success}
                    showYearModal={showYearModal}
                    setShowYearModal={setShowYearModal}
                    showEventModal={showEventModal}
                    setShowEventModal={setShowEventModal}
                    newYear={newYear}
                    setNewYear={setNewYear}
                    newEvent={newEvent}
                    setNewEvent={setNewEvent}
                    handleCreateYear={handleCreateYear}
                    handleCreateEvent={handleCreateEvent}
                    handleEditYear={handleEditYear}
                    handleDeleteYear={handleDeleteYear}
                    handleEditEvent={handleEditEvent}
                    handleDeleteEvent={handleDeleteEvent}
                    yearImage={yearImage}
                    setYearImage={setYearImage}
                    eventThumbnail={eventThumbnail}
                    setEventThumbnail={setEventThumbnail}
                    eventImages={eventImages}
                    setEventImages={setEventImages}
                    editingYear={editingYear}
                    editingEvent={editingEvent}
                    setEditingYear={setEditingYear}
                    setEditingEvent={setEditingEvent}
                    existingEventImages={existingEventImages}
                    setExistingEventImages={setExistingEventImages}
                  />
                )}
                {activeTab === 'settings' && (
                  <SettingsTab user={user} />
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Edit Member Modal */}
      <Modal show={showEditModal} onHide={handleEditCancel} centered size="xl" dialogClassName="admin-modal">
        <Modal.Header closeButton className="admin-modal-header">
          <div className="d-flex align-items-center">
            <div className="admin-stats-icon admin-stats-primary me-3">
              <IconWrapper icon={FaPenToSquare} />
            </div>
            <div>
              <Modal.Title className="fw-bold mb-1 text-white">Edit Member</Modal.Title>
              <p className="mb-0 opacity-90 text-white">Update member information and details</p>
            </div>
          </div>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body className="admin-modal-body">
            {editError && <Alert variant="danger" className="mb-4 border-0 shadow-sm">{editError}</Alert>}
            <MemberForm
              formData={editFormData}
              setFormData={setEditFormData}
              familyMembers={familyMembers}
              setFamilyMembers={setFamilyMembers}
              addFamilyMember={addFamilyMember}
              editFamilyMember={editFamilyMember}
              removeFamilyMember={removeFamilyMember}
              memberPhotoPreview={memberPhotoPreview}
              currentMemberPhotoPreview={currentMemberPhotoPreview}
              handleMemberPhotoUpload={handleMemberPhotoUpload}
              clearMemberPhoto={clearMemberPhoto}
              isEdit={true}

            />
          </Modal.Body>
          <Modal.Footer className="admin-modal-footer d-flex justify-content-center">
            <div className="d-flex gap-3">
              <Button className="admin-btn admin-btn-outline" onClick={handleEditCancel} disabled={editLoading}>
                <IconWrapper icon={FaXmark} className="me-2" />
                Cancel
              </Button>
              <Button className="admin-btn admin-btn-primary" type="submit" disabled={editLoading}>
                {editLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <IconWrapper icon={FaFloppyDisk} className="me-2" />
                    Update Member
                  </>
                )}
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Member Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered dialogClassName="admin-modal">
        <Modal.Header closeButton className="admin-modal-header">
          <Modal.Title className="fw-bold text-white">Delete Member</Modal.Title>
        </Modal.Header>
        <Modal.Body className="admin-modal-body">
          {deleteError && <Alert variant="danger" className="mb-3">{deleteError}</Alert>}
          <p className="mb-2">Are you sure you want to <strong>permanently delete</strong> <strong>{deletingMember?.name}</strong>?</p>
          <p className="text-muted mb-0">
            <strong>Warning:</strong> This action cannot be undone. The member will be completely removed from the system.
          </p>
        </Modal.Body>
        <Modal.Footer className="admin-modal-footer">
          <Button className="admin-btn admin-btn-outline" onClick={handleDeleteCancel} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button className="admin-btn admin-btn-primary" onClick={handleDeleteConfirm} disabled={deleteLoading}>
            {deleteLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Permanently Delete Member'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Member Modal */}
      <Modal show={showAddModal} onHide={handleAddCancel} centered size="xl" dialogClassName="admin-modal">
        <Modal.Header closeButton className="admin-modal-header">
          <div className="d-flex align-items-center">
            <div className="admin-stats-icon admin-stats-primary me-3">
              <IconWrapper icon={FaPlus} />
            </div>
            <div>
              <Modal.Title className="fw-bold mb-1 text-white">Add New Member</Modal.Title>
              <p className="mb-0 opacity-90 text-white">Create a new member account with complete details</p>
            </div>
          </div>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body className="admin-modal-body">
            {addError && <Alert variant="danger" className="mb-4 border-0 shadow-sm">{addError}</Alert>}
            <MemberForm
              formData={addFormData}
              setFormData={setAddFormData}
              familyMembers={familyMembers}
              setFamilyMembers={setFamilyMembers}
              addFamilyMember={addFamilyMember}
              editFamilyMember={editFamilyMember}
              removeFamilyMember={removeFamilyMember}
              memberPhotoPreview={memberPhotoPreview}
              currentMemberPhotoPreview={currentMemberPhotoPreview}
              handleMemberPhotoUpload={handleMemberPhotoUpload}
              clearMemberPhoto={clearMemberPhoto}
              isEdit={false}

            />
          </Modal.Body>
          <Modal.Footer className="admin-modal-footer d-flex justify-content-center">
            <div className="d-flex gap-3">
              <Button className="admin-btn admin-btn-outline" onClick={handleAddCancel} disabled={addLoading}>
                <IconWrapper icon={FaXmark} className="me-2" />
                Cancel
              </Button>
              <Button className="admin-btn admin-btn-primary" type="submit" disabled={addLoading}>
                {addLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <IconWrapper icon={FaPlus} className="me-2" />
                    Add Member
                  </>
                )}
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Family Member Modal */}
      <Modal show={showFamilyModal} onHide={() => setShowFamilyModal(false)} centered size="xl" dialogClassName="admin-modal">
        <Modal.Header closeButton className="admin-modal-header">
          <div className="d-flex align-items-center">
            <div className="admin-stats-icon admin-stats-primary me-3">
              <IconWrapper icon={FaUsers} />
            </div>
            <div>
              <Modal.Title className="fw-bold mb-1 text-white">
                {editingFamilyMember ? 'Edit Family Member' : 'Add Family Member'}
              </Modal.Title>
              <p className="mb-0 opacity-90 text-white">
                {editingFamilyMember ? 'Update family member information' : 'Add a new family member to the profile'}
              </p>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="admin-modal-body">
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-dark">
                    <IconWrapper icon={FaUser} className="me-2" style={{ color: '#0066CC' }} />
                    Name *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={familyFormData.name}
                    onChange={(e) => setFamilyFormData({...familyFormData, name: e.target.value})}
                    required
                    placeholder="Family member name"
                    className="admin-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-dark">
                    <IconWrapper icon={FaUsers} className="me-2" style={{ color: '#0066CC' }} />
                    Relationship *
                  </Form.Label>
                  <Form.Select
                    value={familyFormData.relationship}
                    onChange={(e) => setFamilyFormData({...familyFormData, relationship: e.target.value})}
                    required
                    className="admin-form-control"
                  >
                    <option value="">Select relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Fiancé">Fiancé</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Grandfather">Grandfather</option>
                    <option value="Grandmother">Grandmother</option>
                    <option value="Nephew">Nephew</option>
                    <option value="Niece">Niece</option>
                    <option value="Brother-In-Law">Brother-In-Law</option>
                    <option value="Sister-In-Law">Sister-In-Law</option>
                    <option value="Father-In-Law">Father-In-Law</option>
                    <option value="Mother-In-Law">Mother-In-Law</option>
                    <option value="Uncle">Uncle</option>
                    <option value="Aunt">Aunt</option>
                    <option value="Cousin">Cousin</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-dark">
                    <IconWrapper icon={FaBriefcase} className="me-2" style={{ color: '#0066CC' }} />
                    Profession
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={familyFormData.profession}
                    onChange={(e) => setFamilyFormData({...familyFormData, profession: e.target.value})}
                    placeholder="e.g., Doctor, Engineer, Teacher"
                    className="admin-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-dark">
                    <IconWrapper icon={FaCalendar} className="me-2" style={{ color: '#0066CC' }} />
                    Birthday
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={familyFormData.birthday}
                    onChange={(e) => setFamilyFormData({...familyFormData, birthday: e.target.value})}
                    className="admin-form-control"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">
                <IconWrapper icon={FaCamera} className="me-2" style={{ color: '#0066CC' }} />
                Photo
              </Form.Label>
              <div className="d-flex align-items-center gap-3 mb-3">
                {(familyPhotoPreview || familyFormData.photo) && (
                  <div className="position-relative">
                    <img 
                      src={familyPhotoPreview || familyFormData.photo} 
                      alt="Family member preview" 
                      className="rounded-circle"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                    <Button 
                      size="sm" 
                      variant="danger" 
                      className="position-absolute top-0 end-0 rounded-circle"
                      style={{ width: '20px', height: '20px', fontSize: '10px', padding: '0' }}
                      onClick={clearFamilyPhoto}
                    >
                      ×
                    </Button>
                  </div>
                )}
                <div className="flex-grow-1">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFamilyPhotoUpload}
                    className="admin-form-control"
                  />
                  <small className="text-muted">Upload a photo or enter URL below</small>
                </div>
              </div>
              <Form.Control
                type="url"
                value={familyFormData.photo}
                onChange={(e) => setFamilyFormData({...familyFormData, photo: e.target.value})}
                placeholder="Or enter photo URL: https://example.com/photo.jpg"
                className="admin-form-control"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-dark">
                    <IconWrapper icon={FaHeart} className="me-2" style={{ color: '#0066CC' }} />
                    Hobbies
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={familyFormData.hobbies}
                    onChange={(e) => setFamilyFormData({...familyFormData, hobbies: e.target.value})}
                    placeholder="e.g., Reading, Travel, Music"
                    className="admin-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-dark">
                    <IconWrapper icon={FaUsers} className="me-2" style={{ color: '#0066CC' }} />
                    Personal Bio
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={familyFormData.personalBio}
                    onChange={(e) => setFamilyFormData({...familyFormData, personalBio: e.target.value})}
                    placeholder="Tell us about this family member..."
                    className="admin-form-control"
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4" />

            <h6 className="mb-4 fw-semibold text-dark">
              <IconWrapper icon={FaLocationDot} className="me-2" style={{ color: '#0066CC' }} />
              Additional Details
            </h6>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-dark">
                    <IconWrapper icon={FaPhone} className="me-2" style={{ color: '#0066CC' }} />
                    Phone
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    value={familyFormData.personalDetails.phone}
                    onChange={(e) => setFamilyFormData({
                      ...familyFormData, 
                      personalDetails: {...familyFormData.personalDetails, phone: e.target.value}
                    })}
                    placeholder="Enter phone number"
                    className="admin-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-dark">
                    <IconWrapper icon={FaGraduationCap} className="me-2" style={{ color: '#0066CC' }} />
                    Education
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={familyFormData.personalDetails.education}
                    onChange={(e) => setFamilyFormData({
                      ...familyFormData, 
                      personalDetails: {...familyFormData.personalDetails, education: e.target.value}
                    })}
                    placeholder="e.g., Bachelor's in Engineering"
                    className="admin-form-control"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">
                <IconWrapper icon={FaLocationDot} className="me-2" style={{ color: '#0066CC' }} />
                Address
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={familyFormData.personalDetails.address}
                onChange={(e) => setFamilyFormData({
                  ...familyFormData, 
                  personalDetails: {...familyFormData.personalDetails, address: e.target.value}
                })}
                placeholder="Enter address"
                className="admin-form-control"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-dark">
                    <IconWrapper icon={FaTrophy} className="me-2" style={{ color: '#0066CC' }} />
                    Achievements
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={familyFormData.personalDetails.achievements}
                    onChange={(e) => setFamilyFormData({
                      ...familyFormData, 
                      personalDetails: {...familyFormData.personalDetails, achievements: e.target.value}
                    })}
                    placeholder="List achievements"
                    className="admin-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-dark">
                    <IconWrapper icon={FaStar} className="me-2" style={{ color: '#0066CC' }} />
                    Interests
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={familyFormData.personalDetails.interests}
                    onChange={(e) => setFamilyFormData({
                      ...familyFormData, 
                      personalDetails: {...familyFormData.personalDetails, interests: e.target.value}
                    })}
                    placeholder="List interests"
                    className="admin-form-control"
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4" />

            <h6 className="mb-4 fw-semibold text-dark">
              <IconWrapper icon={FaLinkedin} className="me-2" style={{ color: '#0066CC' }} />
              Social Media
            </h6>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-dark">
                    <IconWrapper icon={FaLinkedin} className="me-2" style={{ color: '#0066CC' }} />
                    LinkedIn
                  </Form.Label>
                  <Form.Control
                    type="url"
                    value={familyFormData.personalDetails.socialMedia.linkedin}
                    onChange={(e) => setFamilyFormData({
                      ...familyFormData, 
                      personalDetails: {
                        ...familyFormData.personalDetails, 
                        socialMedia: {...familyFormData.personalDetails.socialMedia, linkedin: e.target.value}
                      }
                    })}
                    placeholder="LinkedIn URL"
                    className="admin-form-control"
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
                    value={familyFormData.personalDetails.socialMedia.facebook}
                    onChange={(e) => setFamilyFormData({
                      ...familyFormData, 
                      personalDetails: {
                        ...familyFormData.personalDetails, 
                        socialMedia: {...familyFormData.personalDetails.socialMedia, facebook: e.target.value}
                      }
                    })}
                    placeholder="Facebook URL"
                    className="admin-form-control"
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
                    value={familyFormData.personalDetails.socialMedia.twitter}
                    onChange={(e) => setFamilyFormData({
                      ...familyFormData, 
                      personalDetails: {
                        ...familyFormData.personalDetails, 
                        socialMedia: {...familyFormData.personalDetails.socialMedia, twitter: e.target.value}
                      }
                    })}
                    placeholder="Twitter URL"
                    className="admin-form-control"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="admin-modal-footer d-flex justify-content-center">
          <div className="d-flex gap-3">
            <Button className="admin-btn admin-btn-outline" onClick={() => setShowFamilyModal(false)}>
              <IconWrapper icon={FaXmark} className="me-2" />
              Cancel
            </Button>
            <Button className="admin-btn admin-btn-primary" onClick={saveFamilyMember}>
              <IconWrapper icon={FaFloppyDisk} className="me-2" />
              {editingFamilyMember ? 'Update Family Member' : 'Add Family Member'}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Member Search Modal */}
      <MemberSearchModal
        show={showMemberSearchModal}
        onHide={() => setShowMemberSearchModal(false)}
        onLinkMember={linkMemberAsFamily}
      />
    </div>
  );
};

const DashboardTab: React.FC<{ 
  stats: DashboardStats | null; 
  memberStats: MemberStatistics | null;
  calculatedStats: {
    members: {
      total: number;
      active: number;
      currentDirectors: number;
      pastPresidents: number;
    };
    memberStats: {
      totalMembers: number;
      activeMembers: number;
      membersWithLogin: number;
      recentLogins: number;
      loginRate: number;
    };
  };
}> = ({ stats, memberStats, calculatedStats }) => {
  // Use calculated stats for accuracy, fallback to backend stats if available
  const displayStats = calculatedStats;
  const displayMemberStats = calculatedStats.memberStats;

  if (!displayStats) return (
    <div className="text-center py-5">
      <div className="admin-stats-icon admin-stats-primary mx-auto mb-4">
        <IconWrapper icon={FaChartBar} />
      </div>
      <Spinner animation="border" className="admin-spinner" />
      <p className="mt-4 text-white fw-semibold">Loading dashboard statistics...</p>
    </div>
  );

  return (
    <div className="admin-content">
      {/* Main Stats */}
      <Row className="mb-4 admin-dashboard-stats">
        <Col xs={12} sm={6} lg={3} className="mb-3">
          <Card className="admin-stats-card text-center h-100">
            <Card.Body className="p-3 p-md-4">
              <div className="admin-stats-icon admin-stats-primary mx-auto mb-3">
                <IconWrapper icon={FaUsers} />
              </div>
              <h3 className="fw-bold text-dark mb-2">{displayStats.members.total}</h3>
              <p className="text-muted mb-0 fw-semibold">Total Members</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3} className="mb-3">
          <Card className="admin-stats-card text-center h-100">
            <Card.Body className="p-3 p-md-4">
              <div className="admin-stats-icon admin-stats-success mx-auto mb-3">
                <IconWrapper icon={FaUserCheck} />
              </div>
              <h3 className="fw-bold text-dark mb-2">{displayStats.members.active}</h3>
              <p className="text-muted mb-0 fw-semibold">Active Members</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3} className="mb-3">
          <Card className="admin-stats-card text-center h-100">
            <Card.Body className="p-3 p-md-4">
              <div className="admin-stats-icon admin-stats-info mx-auto mb-3">
                <IconWrapper icon={FaEye} />
              </div>
              <h3 className="fw-bold text-dark mb-2">{displayStats.members.currentDirectors}</h3>
              <p className="text-muted mb-0 fw-semibold">Current Directors</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3} className="mb-3">
          <Card className="admin-stats-card text-center h-100">
            <Card.Body className="p-3 p-md-4">
              <div className="admin-stats-icon admin-stats-warning mx-auto mb-3">
                <IconWrapper icon={FaCalendar} />
              </div>
              <h3 className="fw-bold text-dark mb-2">{displayStats.members.pastPresidents}</h3>
              <p className="text-muted mb-0 fw-semibold">Past Presidents</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Login Activity Stats */}
      <Row className="admin-dashboard-stats">
        <Col xs={12} sm={6} lg={3} className="mb-3">
          <Card className="admin-stats-card text-center h-100">
            <Card.Body className="p-3 p-md-4">
              <div className="admin-stats-icon admin-stats-primary mx-auto mb-3">
                <IconWrapper icon={FaUserCheck} />
              </div>
              <h3 className="fw-bold text-dark mb-2">{displayMemberStats.membersWithLogin}</h3>
              <p className="text-muted mb-0 fw-semibold">Have Logged In</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3} className="mb-3">
          <Card className="admin-stats-card text-center h-100">
            <Card.Body className="p-3 p-md-4">
              <div className="admin-stats-icon admin-stats-success mx-auto mb-3">
                <IconWrapper icon={FaClock} />
              </div>
              <h3 className="fw-bold text-dark mb-2">{displayMemberStats.recentLogins}</h3>
              <p className="text-muted mb-0 fw-semibold">Recent Logins (7 days)</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3} className="mb-3">
          <Card className="admin-stats-card text-center h-100">
            <Card.Body className="p-3 p-md-4">
              <div className="admin-stats-icon admin-stats-info mx-auto mb-3">
                <IconWrapper icon={FaChartBar} />
              </div>
              <h3 className="fw-bold text-dark mb-2">{displayMemberStats.loginRate}%</h3>
              <p className="text-muted mb-0 fw-semibold">Login Rate</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3} className="mb-3">
          <Card className="admin-stats-card text-center h-100">
            <Card.Body className="p-3 p-md-4">
              <div className="admin-stats-icon admin-stats-danger mx-auto mb-3">
                <IconWrapper icon={FaUserXmark} />
              </div>
              <h3 className="fw-bold text-dark mb-2">{displayMemberStats.totalMembers - displayMemberStats.membersWithLogin}</h3>
              <p className="text-muted mb-0 fw-semibold">Never Logged In</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const MembersTab: React.FC<{
  members: Member[];
  memberStats: MemberStatistics | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  sortBy: string;
  sortOrder: string;
  statusFilter: string;
  onSearch: (e: React.FormEvent) => void;
  onSort: (field: string) => void;
  onStatusFilterChange: (newStatus: string) => void;
  onStatusToggle: (member: Member) => void;
  getStatusBadge: (status: string) => React.ReactElement;
  getLoginStatusBadge: (member: Member) => React.ReactElement;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  onAdd: () => void;
  useClientSideFiltering: boolean;
  setUseClientSideFiltering: (use: boolean) => void;
}> = ({ 
  members, 
  memberStats, 
  searchTerm, 
  setSearchTerm, 
  currentPage, 
  setCurrentPage, 
  totalPages, 
  sortBy, 
  sortOrder, 
  statusFilter, 
  onSearch, 
  onSort, 
  onStatusFilterChange, 
  onStatusToggle, 
  getStatusBadge, 
  getLoginStatusBadge, 
  onEdit, 
  onDelete, 
  onAdd,
  useClientSideFiltering,
  setUseClientSideFiltering
}) => {
  return (
    <div className="admin-content">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold admin-text-gradient mb-2">Members Management</h3>
          <p className="text-white opacity-90 mb-0">Manage and monitor member accounts</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Button 
            className={`admin-btn ${useClientSideFiltering ? 'admin-btn-success' : 'admin-btn-outline'}`}
            size="sm"
            onClick={() => setUseClientSideFiltering(!useClientSideFiltering)}
            title={useClientSideFiltering ? "Switch to Server-side Filtering" : "Switch to Client-side Filtering"}
          >
            {useClientSideFiltering ? "⚡ Client-side" : "🖥️ Server-side"}
          </Button>
          <Button 
            className="admin-btn admin-btn-primary"
            size="sm"
            onClick={onAdd}
          >
            <IconWrapper icon={FaPlus} className="me-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Account Setup Info */}
      <Alert variant="info" className="mb-4 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <div className="d-flex align-items-start">
          <IconWrapper icon={FaKey} className="me-3 mt-1" style={{ color: '#0066CC' }} />
          <div>
            <h6 className="fw-bold mb-2">New Feature: Account Setup for Members</h6>
            <p className="mb-2">
              Members added through the admin dashboard can now set up their own passwords and complete their account setup. 
              They can do this by visiting the member login page and using the "Account Setup" tab.
            </p>
            <p className="mb-0 small">
              <strong>How it works:</strong> Members use their email address (the one you added them with) and an access key to set up their password. 
              Once set up, they can login normally through the member portal.
            </p>
          </div>
        </div>
      </Alert>

      {/* Quick Stats */}
      {memberStats && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="admin-stats-card text-center">
              <Card.Body className="p-3">
                <h5 className="fw-bold text-dark mb-1">{memberStats.totalMembers}</h5>
                <p className="text-muted mb-0 small fw-semibold">Total Members</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="admin-stats-card text-center">
              <Card.Body className="p-3">
                <h5 className="fw-bold text-dark mb-1">{memberStats.membersWithLogin}</h5>
                <p className="text-muted mb-0 small fw-semibold">Have Logged In</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="admin-stats-card text-center">
              <Card.Body className="p-3">
                <h5 className="fw-bold text-dark mb-1">{memberStats.recentLogins}</h5>
                <p className="text-muted mb-0 small fw-semibold">Recent Logins</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="admin-stats-card text-center">
              <Card.Body className="p-3">
                <h5 className="fw-bold text-dark mb-1">{memberStats.loginRate}%</h5>
                <p className="text-muted mb-0 small fw-semibold">Login Rate</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      {/* Search and Table */}
      <Card className="admin-card">
        <Card.Body className="p-4">
          {/* Search and Filter Bar */}
          <Row className="mb-4 admin-search-filters">
            <Col xs={12} md={8} className="mb-3 mb-md-0">
              <Form onSubmit={onSearch}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search members by name, email, or designation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-form-control"
                    style={{ borderRadius: '12px 0 0 12px' }}
                  />
                  <Button 
                    type="submit" 
                    className="admin-btn admin-btn-outline"
                    style={{ borderRadius: '0 12px 12px 0' }}
                  >
                    <IconWrapper icon={FaMagnifyingGlass} />
                  </Button>
                </InputGroup>
              </Form>
            </Col>
            <Col xs={12} md={4}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="admin-form-control"
              >
                <option value="active">Active Members Only</option>
                <option value="inactive">Inactive Members Only</option>
                <option value="all">All Members</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Mobile Card Layout */}
          <div className="d-block d-md-none">
            {members.length === 0 ? (
              <div className="text-center py-5">
                <div className="text-muted">
                  <IconWrapper icon={FaUsers} className="fs-1 mb-3" />
                  <p className="mb-0">No members found</p>
                </div>
              </div>
            ) : (
              <div className="row">
                {members.map((member) => (
                  <div key={member._id} className="col-12 mb-3">
                    <Card className="admin-card">
                      <Card.Body className="p-3">
                        <div className="mb-2">
                          <h6 className="fw-bold text-dark mb-1">{member.name}</h6>
                          <p className="text-muted small mb-1">{member.email}</p>
                          <p className="text-muted small mb-1">{member.currentDesignation || 'Member'}</p>
                          <div className="d-flex gap-1 mb-2">
                            {getStatusBadge(member.status)}
                            {getLoginStatusBadge(member)}
                          </div>
                          <div className="d-flex gap-2 justify-content-start">
                            <Button 
                              size="sm" 
                              className={`admin-btn ${member.status === 'active' ? 'admin-btn-outline' : 'admin-btn-primary'}`}
                              onClick={() => onStatusToggle(member)}
                              title={member.status === 'active' ? 'Deactivate Member' : 'Activate Member'}
                            >
                              {member.status === 'active' ? (
                                <IconWrapper icon={FaUserXmark} />
                              ) : (
                                <IconWrapper icon={FaUserCheck} />
                              )}
                            </Button>
                            <Button size="sm" className="admin-btn admin-btn-outline" onClick={() => onEdit(member)}>
                              <IconWrapper icon={FaPenToSquare} />
                            </Button>
                            <Button size="sm" className="admin-btn admin-btn-outline" onClick={() => onDelete(member)}>
                              <IconWrapper icon={FaTrash} />
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="d-none d-md-block table-responsive admin-table-responsive">
            <Table className="admin-table mb-0">
              <thead>
                <tr>
                  <th className="d-none d-md-table-cell">
                    <Button 
                      variant="link" 
                      className="p-0 text-decoration-none fw-semibold text-dark"
                      onClick={() => onSort('name')}
                    >
                      Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </Button>
                  </th>
                  <th className="d-none d-lg-table-cell">
                    <span className="fw-semibold text-dark">Email</span>
                  </th>
                  <th className="d-none d-md-table-cell">
                    <span className="fw-semibold text-dark">Current Designation</span>
                  </th>
                  <th className="d-none d-lg-table-cell">
                    <Button 
                      variant="link" 
                      className="p-0 text-decoration-none fw-semibold text-dark"
                      onClick={() => onSort('createdAt')}
                    >
                      Signup Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </Button>
                  </th>
                  <th className="d-none d-lg-table-cell">
                    <Button 
                      variant="link" 
                      className="p-0 text-decoration-none fw-semibold text-dark"
                      onClick={() => onSort('lastLogin')}
                    >
                      Last Login {sortBy === 'lastLogin' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </Button>
                  </th>
                  <th className="d-none d-md-table-cell">
                    <span className="fw-semibold text-dark">Status</span>
                  </th>
                  <th>
                    <span className="fw-semibold text-dark">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <div className="text-muted">
                        <IconWrapper icon={FaUsers} className="fs-1 mb-3" />
                        <p className="mb-0">No members found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr key={member._id}>
                      <td className="d-none d-md-table-cell">
                        <div>
                          <div className="fw-semibold text-dark">{member.name}</div>
                        </div>
                      </td>
                      <td className="d-none d-lg-table-cell">
                        <span className="text-muted">{member.email}</span>
                      </td>
                      <td className="d-none d-md-table-cell">
                        <div>
                          <span className="text-muted">{member.currentDesignation || 'Member'}</span>
                          {member.currentDesignation && (
                            <Badge className="admin-badge bg-success ms-2 px-2 py-1" style={{ fontSize: '10px' }}>
                              Current Director
                            </Badge>
                          )}
                          {member.isPastPresident && (
                            <Badge className="admin-badge bg-warning ms-2 px-2 py-1" style={{ fontSize: '10px' }}>
                              Past President
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="d-none d-lg-table-cell">
                        <span className="text-muted">{member.signupText || 'N/A'}</span>
                      </td>
                      <td className="d-none d-lg-table-cell">
                        {getLoginStatusBadge(member)}
                      </td>
                      <td className="d-none d-md-table-cell">
                        {getStatusBadge(member.status)}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            size="sm" 
                            className={`admin-btn ${member.status === 'active' ? 'admin-btn-outline' : 'admin-btn-primary'}`}
                            onClick={() => onStatusToggle(member)}
                            title={member.status === 'active' ? 'Deactivate Member' : 'Activate Member'}
                          >
                            {member.status === 'active' ? (
                              <IconWrapper icon={FaUserXmark} />
                            ) : (
                              <IconWrapper icon={FaUserCheck} />
                            )}
                          </Button>
                          <Button size="sm" className="admin-btn admin-btn-outline" onClick={() => onEdit(member)}>
                            <IconWrapper icon={FaPenToSquare} />
                          </Button>
                          <Button size="sm" className="admin-btn admin-btn-outline" onClick={() => onDelete(member)}>
                            <IconWrapper icon={FaTrash} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4 admin-pagination">
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <Button 
                      className="page-link border-0" 
                      variant="link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <span className="d-none d-sm-inline">Previous</span>
                      <span className="d-inline d-sm-none">←</span>
                    </Button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <Button 
                        className="page-link border-0" 
                        variant="link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <Button 
                      className="page-link border-0" 
                      variant="link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <span className="d-none d-sm-inline">Next</span>
                      <span className="d-inline d-sm-none">→</span>
                    </Button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

const ServicesTab: React.FC = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
  const [servicesData, setServicesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [deletingProject, setDeletingProject] = useState<{id: string, serviceId: string} | null>(null);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    image: '',
    alt: '',
    serviceId: ''
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Loading states for different actions
  const [savingProject, setSavingProject] = useState(false);
  const [deletingProjectLoading, setDeletingProjectLoading] = useState(false);
  const [refreshingData, setRefreshingData] = useState(false);

  const loadServicesData = useCallback(async () => {
    try {
      if (!refreshingData) {
        setLoading(true);
      }
      const memberToken = localStorage.getItem('memberToken');
      const adminToken = localStorage.getItem('adminToken');
      const token = memberToken || adminToken;
      
      const response = await fetch(`${API_BASE_URL}/services`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setServicesData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services data');
    } finally {
      setLoading(false);
      setRefreshingData(false);
    }
  }, [API_BASE_URL, refreshingData]);

  useEffect(() => {
    loadServicesData();
  }, [loadServicesData]);

  const handleAddProject = () => {
    setProjectFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      image: '',
      alt: '',
      serviceId: selectedService || ''
    });
    setImagePreview('');
    setShowAddProjectModal(true);
  };

  const handleEditProject = (project: any, serviceId: string) => {
    setEditingProject(project);
    setProjectFormData({
      title: project.title,
      date: project.date,
      description: project.description,
      image: project.image,
      alt: project.alt,
      serviceId: serviceId
    });
    setImagePreview(project.image || '');
    setShowEditProjectModal(true);
  };

  const handleDeleteProject = (projectId: string, serviceId: string) => {
    setDeletingProject({ id: projectId, serviceId });
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    
    try {
      setDeletingProjectLoading(true);
      const memberToken = localStorage.getItem('memberToken');
      const adminToken = localStorage.getItem('adminToken');
      const token = memberToken || adminToken;
      
      const response = await fetch(`${API_BASE_URL}/services/projects/${deletingProject.id}?serviceId=${deletingProject.serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete project');
      }
      
      // Reload services data
      setRefreshingData(true);
      await loadServicesData();
      setShowDeleteConfirmModal(false);
      setDeletingProject(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete project');
    } finally {
      setDeletingProjectLoading(false);
      setRefreshingData(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setProjectFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview('');
    setProjectFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSavingProject(true);
      const memberToken = localStorage.getItem('memberToken');
      const adminToken = localStorage.getItem('adminToken');
      const token = memberToken || adminToken;
      
      if (editingProject) {
        // Update existing project
        const response = await fetch(`${API_BASE_URL}/services/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            serviceId: projectFormData.serviceId,
            project: {
              title: projectFormData.title,
              date: projectFormData.date,
              description: projectFormData.description,
              image: projectFormData.image,
              alt: projectFormData.alt
            }
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update project');
        }
        
        // Reload services data
        await loadServicesData();
      } else {
        // Add new project
        const response = await fetch(`${API_BASE_URL}/services/projects`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            serviceId: projectFormData.serviceId,
            project: {
              title: projectFormData.title,
              date: projectFormData.date,
              description: projectFormData.description,
              image: projectFormData.image,
              alt: projectFormData.alt
            }
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add project');
        }
        
        // Reload services data
        await loadServicesData();
      }
      
      setShowAddProjectModal(false);
      setShowEditProjectModal(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Error saving project:', error);
      alert(error instanceof Error ? error.message : 'Failed to save project');
    } finally {
      setSavingProject(false);
      setRefreshingData(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" className="admin-spinner" />
        <p className="mt-4 text-white fw-semibold">Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <Alert variant="danger" className="border-0 shadow-sm">
          <h4>Error Loading Services</h4>
          <p>{error}</p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="admin-content">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold admin-text-gradient mb-2">Services Management</h3>
          <p className="text-white opacity-90 mb-0">Manage service projects and categories</p>
        </div>
        <div className="d-flex gap-2">
          <Button 
            className="admin-btn admin-btn-primary"
            onClick={handleAddProject}
            disabled={!selectedService || savingProject}
          >
            {savingProject ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <IconWrapper icon={FaPlus} className="me-2" />
                Add Project
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Service Categories */}
      {refreshingData && (
        <div className="text-center mb-3">
          <Spinner animation="border" size="sm" className="me-2" />
          <span className="text-white">Refreshing data...</span>
        </div>
      )}
      <Row className="mb-4">
        {servicesData?.services?.map((service: any) => (
          <Col key={service.id} xs={12} md={6} lg={4} className="mb-4">
            <Card 
              className={`admin-card h-100 ${selectedService === service.id ? 'border-primary' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
            >
              <Card.Body className="text-center p-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}>
                  {service.icon}
                </div>
                <Card.Title className="fw-bold mb-2">{service.title}</Card.Title>
                <Card.Text className="text-muted mb-3">{service.description}</Card.Text>
                <Badge bg="primary" className="px-3 py-2">
                  {service.projects?.length || 0} {service.projects?.length === 1 ? 'Project' : 'Projects'}
                </Badge>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Projects by Selected Service */}
      {selectedService && (
        <Card className="admin-card">
          <Card.Header className="bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                {servicesData?.services?.find((s: any) => s.id === selectedService)?.title} Projects
              </h5>
              <Button 
                variant="light" 
                size="sm"
                onClick={() => setSelectedService(null)}
              >
                ← Back to All Services
              </Button>
            </div>
          </Card.Header>
          <Card.Body className="p-4">
            <Row>
              {servicesData?.services
                ?.find((s: any) => s.id === selectedService)
                ?.projects?.map((project: any, index: number) => (
                  <Col key={project.id} xs={12} md={6} lg={4} className="mb-4">
                    <Card className="h-100">
                      <img 
                        src={project.image} 
                        alt={project.alt}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <Card.Body>
                        <h6 className="fw-bold">{project.title}</h6>
                        <p className="text-muted small mb-2">{project.date}</p>
                        <p className="small">{project.description}</p>
                        <div className="d-flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline-primary"
                            onClick={() => handleEditProject(project, selectedService)}
                            disabled={savingProject}
                          >
                            <IconWrapper icon={FaPenToSquare} className="me-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-danger"
                            onClick={() => handleDeleteProject(project.id, selectedService)}
                            disabled={deletingProjectLoading}
                          >
                            {deletingProjectLoading && deletingProject?.id === project.id ? (
                              <>
                                <Spinner animation="border" size="sm" className="me-1" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <IconWrapper icon={FaTrash} className="me-1" />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Add Project Modal */}
      <Modal show={showAddProjectModal} onHide={() => setShowAddProjectModal(false)} centered size="lg" dialogClassName="admin-modal">
        <Modal.Header closeButton className="admin-modal-header">
          <Modal.Title className="fw-bold text-white">Add New Project</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveProject}>
          <Modal.Body className="admin-modal-body">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Project Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={projectFormData.title}
                    onChange={(e) => setProjectFormData({...projectFormData, title: e.target.value})}
                    required
                    className="admin-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={projectFormData.date}
                    onChange={(e) => setProjectFormData({...projectFormData, date: e.target.value})}
                    required
                    className="admin-form-control"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={projectFormData.description}
                onChange={(e) => setProjectFormData({...projectFormData, description: e.target.value})}
                required
                className="admin-form-control"
              />
            </Form.Group>
            
            {/* Image Upload Section */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Project Image</Form.Label>
              <div className="d-flex align-items-center gap-3 mb-3">
                {(imagePreview || projectFormData.image) && (
                  <div className="position-relative">
                    <img 
                      src={imagePreview || projectFormData.image} 
                      alt="Project preview" 
                      className="rounded"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                    <Button 
                      size="sm" 
                      variant="danger" 
                      className="position-absolute top-0 end-0 rounded-circle"
                      style={{ width: '20px', height: '20px', fontSize: '10px', padding: '0' }}
                      onClick={clearImage}
                    >
                      ×
                    </Button>
                  </div>
                )}
                <div className="flex-grow-1">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="admin-form-control"
                  />
                  <small className="text-muted">Upload an image or enter URL below</small>
                </div>
              </div>
              <Form.Control
                type="url"
                value={projectFormData.image}
                onChange={(e) => setProjectFormData({...projectFormData, image: e.target.value})}
                placeholder="Or enter image URL: https://example.com/image.jpg"
                className="admin-form-control"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Alt Text</Form.Label>
              <Form.Control
                type="text"
                value={projectFormData.alt}
                onChange={(e) => setProjectFormData({...projectFormData, alt: e.target.value})}
                placeholder="Image description for accessibility"
                className="admin-form-control"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="admin-modal-footer">
            <Button className="admin-btn admin-btn-outline" onClick={() => setShowAddProjectModal(false)} disabled={savingProject}>
              Cancel
            </Button>
            <Button className="admin-btn admin-btn-primary" type="submit" disabled={savingProject}>
              {savingProject ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Adding Project...
                </>
              ) : (
                'Add Project'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Project Modal */}
      <Modal show={showEditProjectModal} onHide={() => setShowEditProjectModal(false)} centered size="lg" dialogClassName="admin-modal">
        <Modal.Header closeButton className="admin-modal-header">
          <Modal.Title className="fw-bold text-white">Edit Project</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveProject}>
          <Modal.Body className="admin-modal-body">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Project Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={projectFormData.title}
                    onChange={(e) => setProjectFormData({...projectFormData, title: e.target.value})}
                    required
                    className="admin-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={projectFormData.date}
                    onChange={(e) => setProjectFormData({...projectFormData, date: e.target.value})}
                    required
                    className="admin-form-control"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={projectFormData.description}
                onChange={(e) => setProjectFormData({...projectFormData, description: e.target.value})}
                required
                className="admin-form-control"
              />
            </Form.Group>
            
            {/* Image Upload Section */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Project Image</Form.Label>
              <div className="d-flex align-items-center gap-3 mb-3">
                {(imagePreview || projectFormData.image) && (
                  <div className="position-relative">
                    <img 
                      src={imagePreview || projectFormData.image} 
                      alt="Project preview" 
                      className="rounded"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                    <Button 
                      size="sm" 
                      variant="danger" 
                      className="position-absolute top-0 end-0 rounded-circle"
                      style={{ width: '20px', height: '20px', fontSize: '10px', padding: '0' }}
                      onClick={clearImage}
                    >
                      ×
                    </Button>
                  </div>
                )}
                <div className="flex-grow-1">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="admin-form-control"
                  />
                  <small className="text-muted">Upload an image or enter URL below</small>
                </div>
              </div>
              <Form.Control
                type="url"
                value={projectFormData.image}
                onChange={(e) => setProjectFormData({...projectFormData, image: e.target.value})}
                placeholder="Or enter image URL: https://example.com/image.jpg"
                className="admin-form-control"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Alt Text</Form.Label>
              <Form.Control
                type="text"
                value={projectFormData.alt}
                onChange={(e) => setProjectFormData({...projectFormData, alt: e.target.value})}
                placeholder="Image description for accessibility"
                className="admin-form-control"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="admin-modal-footer">
            <Button className="admin-btn admin-btn-outline" onClick={() => setShowEditProjectModal(false)} disabled={savingProject}>
              Cancel
            </Button>
            <Button className="admin-btn admin-btn-primary" type="submit" disabled={savingProject}>
              {savingProject ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Updating Project...
                </>
              ) : (
                'Update Project'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirmModal} onHide={() => setShowDeleteConfirmModal(false)} centered dialogClassName="admin-modal">
        <Modal.Header closeButton className="admin-modal-header">
          <Modal.Title className="fw-bold text-white">Delete Project</Modal.Title>
        </Modal.Header>
        <Modal.Body className="admin-modal-body">
          <p className="mb-0">Are you sure you want to delete this project? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer className="admin-modal-footer">
          <Button className="admin-btn admin-btn-outline" onClick={() => setShowDeleteConfirmModal(false)} disabled={deletingProjectLoading}>
            Cancel
          </Button>
          <Button className="admin-btn admin-btn-primary" onClick={handleConfirmDelete} disabled={deletingProjectLoading}>
            {deletingProjectLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting Project...
              </>
            ) : (
              'Delete Project'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const SettingsTab: React.FC<{ user: User | null }> = ({ user }) => {
  return (
    <div className="admin-content">
      <Card className="admin-card">
      <Card.Header className="admin-modal-header">
        <h5 className="fw-bold mb-0 text-white">Account Settings</h5>
      </Card.Header>
      <Card.Body className="p-4">
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold text-dark">Username</Form.Label>
                <Form.Control 
                  type="text" 
                  value={user?.username || ''} 
                  readOnly 
                  className="admin-form-control"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold text-dark">Email</Form.Label>
                <Form.Control 
                  type="email" 
                  value={user?.email || ''} 
                  readOnly 
                  className="admin-form-control"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold text-dark">Role</Form.Label>
                <Form.Control 
                  type="text" 
                  value={user?.role || ''} 
                  readOnly 
                  className="admin-form-control"
                />
              </Form.Group>
            </Col>
          </Row>
          <Button 
            className="admin-btn admin-btn-primary"
          >
            Update Profile
          </Button>
        </Form>
      </Card.Body>
    </Card>
    </div>
  );
};

// Comprehensive Member Form Component
const MemberForm: React.FC<{
  formData: any;
  setFormData: (data: any) => void;
  familyMembers: FamilyMember[];
  setFamilyMembers: (members: FamilyMember[]) => void;
  addFamilyMember: () => void;
  editFamilyMember: (member: FamilyMember) => void;
  removeFamilyMember: (id: string) => void;
  memberPhotoPreview: string;
  currentMemberPhotoPreview: string;
  handleMemberPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearMemberPhoto: () => void;
  isEdit?: boolean;
  showMemberSearch?: boolean;
  setShowMemberSearch?: (show: boolean) => void;
  memberSearchResults?: Member[];
  memberSearchTerm?: string;
  setMemberSearchTerm?: (term: string) => void;
  handleMemberSearch?: (e: React.FormEvent) => void;
  linkMemberAsFamily?: (member: Member, relationship: string) => Promise<void>;
}> = ({ 
  formData, 
  setFormData, 
  familyMembers, 
  setFamilyMembers, 
  addFamilyMember, 
  editFamilyMember, 
  removeFamilyMember,
  memberPhotoPreview,
  currentMemberPhotoPreview,
  handleMemberPhotoUpload,
  clearMemberPhoto,
  isEdit = false 
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <div>
      {/* Tab Navigation */}
      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'basic'} 
            onClick={() => setActiveTab('basic')}
            className="border-0 px-4 py-3 fw-semibold"
          >
            <IconWrapper icon={FaUser} className="me-2" />
            Basic Info
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'personal'} 
            onClick={() => setActiveTab('personal')}
            className="border-0 px-4 py-3 fw-semibold"
          >
            <IconWrapper icon={FaLocationDot} className="me-2" />
            Personal Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'family'} 
            onClick={() => setActiveTab('family')}
            className="border-0 px-4 py-3 fw-semibold"
          >
            <IconWrapper icon={FaUsers} className="me-2" />
            Family Members
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'social'} 
            onClick={() => setActiveTab('social')}
            className="border-0 px-4 py-3 fw-semibold"
          >
            <IconWrapper icon={FaLinkedin} className="me-2" />
            Social Media
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Basic Information Tab */}
      {activeTab === 'basic' && (
        <div>
          <Card className="shadow-sm border-0 mb-4" style={{ borderRadius: '15px' }}>
            <Card.Header className="bg-light border-0" style={{ borderRadius: '15px 15px 0 0' }}>
              <h6 className="fw-bold mb-0">
                <IconWrapper icon={FaUser} className="me-2" style={{ color: '#0066CC' }} />
                Basic Information
              </h6>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-5">
                    <Form.Label className="fw-semibold text-dark">
                      <IconWrapper icon={FaUser} className="me-2" style={{ color: '#0066CC' }} />
                      Full Name *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      placeholder="Enter full name"
                      className="admin-form-control"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-5">
                    <Form.Label className="fw-semibold text-dark">
                      <IconWrapper icon={FaEnvelope} className="me-2" style={{ color: '#0066CC' }} />
                      Email Address *
                    </Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      placeholder="Enter email address"
                      className="admin-form-control"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-5">
                    <Form.Label className="fw-semibold text-dark">
                      <IconWrapper icon={FaTag} className="me-2" style={{ color: '#0066CC' }} />
                      Classification *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.classification}
                      onChange={(e) => setFormData({...formData, classification: e.target.value})}
                      required
                      placeholder="e.g., Member, Honorary, Charter"
                      className="admin-form-control"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-5">
                    <Form.Label className="fw-semibold text-dark">
                      <IconWrapper icon={FaCalendar} className="me-2" style={{ color: '#0066CC' }} />
                      Join Date *
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                      required
                      className="admin-form-control"
                    />
                  </Form.Group>
                </Col>
              </Row>
          
          <Row>
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold text-dark">
                  <IconWrapper icon={FaCamera} className="me-2" style={{ color: '#0066CC' }} />
                  Profile Picture
                </Form.Label>
                <div className="d-flex align-items-center gap-3 mb-3">
                  {(currentMemberPhotoPreview || formData.profileImage) && (
                    <div className="position-relative">
                      <img 
                        src={currentMemberPhotoPreview || formData.profileImage} 
                        alt="Profile preview" 
                        className="rounded-circle"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                      <Button 
                        size="sm" 
                        variant="danger" 
                        className="position-absolute top-0 end-0 rounded-circle"
                        style={{ width: '24px', height: '24px', fontSize: '12px', padding: '0' }}
                        onClick={clearMemberPhoto}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                  <div className="flex-grow-1">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleMemberPhotoUpload}
                      className="admin-form-control"
                    />
                    <small className="text-muted">Upload a profile picture or enter URL below</small>
                  </div>
                </div>
                <Form.Control
                  type="url"
                  value={formData.profileImage}
                  onChange={(e) => setFormData({...formData, profileImage: e.target.value})}
                  placeholder="Or enter image URL: https://example.com/profile.jpg"
                  className="admin-form-control"
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
                  value={formData.currentDesignation}
                  onChange={(e) => setFormData({...formData, currentDesignation: e.target.value})}
                  placeholder="e.g., President, Secretary, Treasurer"
                  className="admin-form-control"
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
                  value={formData.profession}
                  onChange={(e) => setFormData({...formData, profession: e.target.value})}
                  placeholder="e.g., Doctor, Engineer, Business Owner"
                  className="admin-form-control"
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
                  value={formData.birthday}
                  onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                  className="admin-form-control"
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
                  value={formData.hobbies}
                  onChange={(e) => setFormData({...formData, hobbies: e.target.value})}
                  placeholder="e.g., Reading, Travel, Music"
                  className="admin-form-control"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-dark">
              <IconWrapper icon={FaUsers} className="me-2" style={{ color: '#0066CC' }} />
              Personal Bio
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={formData.personalBio}
              onChange={(e) => setFormData({...formData, personalBio: e.target.value})}
              placeholder="Tell us about yourself..."
              className="admin-form-control"
            />
          </Form.Group>
          
          <hr className="my-4" />
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="isPastPresident"
                  checked={formData.isPastPresident}
                  onChange={(e) => setFormData({...formData, isPastPresident: e.target.checked})}
                  label={
                    <span className="fw-semibold text-dark">
                      <IconWrapper icon={FaTrophy} className="me-2" style={{ color: '#0066CC' }} />
                      Past President
                    </span>
                  }
                  className="mb-3"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              {formData.isPastPresident && (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-dark">
                    <IconWrapper icon={FaCalendar} className="me-2" style={{ color: '#0066CC' }} />
                    Presidential Years
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.presidentialYears?.join(', ') || ''}
                    onChange={(e) => {
                      const input = e.target.value;
                      // Split by comma and clean up each entry
                      const years = input.split(',')
                        .map(year => year.trim())
                        .filter(year => year.length > 0);
                      setFormData({
                        ...formData, 
                        presidentialYears: years
                      });
                    }}
                    placeholder="e.g., 2020-2021, 2022-2023, 2024-2025"
                    className="admin-form-control"
                  />
                  <small className="text-muted">
                    Enter presidential years separated by commas. You can use ranges like "2020-2021" or single years like "2020".
                  </small>
                </Form.Group>
              )}
            </Col>
          </Row>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Personal Details Tab */}
      {activeTab === 'personal' && (
        <div>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-dark">
              <IconWrapper icon={FaLocationDot} className="me-2" style={{ color: '#0066CC' }} />
              Address
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.personalDetails.address}
              onChange={(e) => setFormData({
                ...formData, 
                personalDetails: {...formData.personalDetails, address: e.target.value}
              })}
              placeholder="Enter your address"
              className="admin-form-control"
            />
          </Form.Group>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold text-dark">
                  <IconWrapper icon={FaPhone} className="me-2" style={{ color: '#0066CC' }} />
                  Phone
                </Form.Label>
                <Form.Control
                  type="tel"
                  value={formData.personalDetails.phone}
                  onChange={(e) => setFormData({
                    ...formData, 
                    personalDetails: {...formData.personalDetails, phone: e.target.value}
                  })}
                  placeholder="Enter phone number"
                  className="admin-form-control"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold text-dark">
                  <IconWrapper icon={FaGraduationCap} className="me-2" style={{ color: '#0066CC' }} />
                  Education
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.personalDetails.education}
                  onChange={(e) => setFormData({
                    ...formData, 
                    personalDetails: {...formData.personalDetails, education: e.target.value}
                  })}
                  placeholder="e.g., Bachelor's in Engineering"
                  className="admin-form-control"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold text-dark">
                  <IconWrapper icon={FaTrophy} className="me-2" style={{ color: '#0066CC' }} />
                  Achievements
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.personalDetails.achievements}
                  onChange={(e) => setFormData({
                    ...formData, 
                    personalDetails: {...formData.personalDetails, achievements: e.target.value}
                  })}
                  placeholder="List your achievements"
                  className="admin-form-control"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold text-dark">
                  <IconWrapper icon={FaStar} className="me-2" style={{ color: '#0066CC' }} />
                  Interests
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.personalDetails.interests}
                  onChange={(e) => setFormData({
                    ...formData, 
                    personalDetails: {...formData.personalDetails, interests: e.target.value}
                  })}
                  placeholder="List your interests"
                  className="admin-form-control"
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      )}

      {/* Family Members Tab */}
      {activeTab === 'family' && (
        <div>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="fw-semibold text-dark mb-0">
              <IconWrapper icon={FaUsers} className="me-2" style={{ color: '#0066CC' }} />
              Family Members
            </h6>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={addFamilyMember}
              className="rounded-pill"
            >
              <IconWrapper icon={FaPlus} className="me-2" />
              Add Family Member
            </Button>
          </div>
          
          {familyMembers.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p className="mb-3">No family members added yet.</p>
              <div className="d-flex justify-content-center gap-3">
                <Button variant="outline-primary" onClick={addFamilyMember} size="lg" className="rounded-pill">
                  <IconWrapper icon={FaPlus} className="me-2" />
                  Add Family Member
                </Button>
                <Button variant="outline-success" onClick={() => window.dispatchEvent(new CustomEvent('openMemberSearch'))} size="lg" className="rounded-pill">
                  <IconWrapper icon={FaUsers} className="me-2" />
                  Link Existing Member
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {familyMembers.map((familyMember, index) => (
                <div key={familyMember.id} className="d-flex align-items-center justify-content-between bg-white rounded-3 p-3 mb-3 border shadow-sm">
                  <div className="d-flex align-items-center">
                    <div className="position-relative me-3">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" 
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
                    </div>
                    <div>
                      <div className="fw-semibold text-dark">{familyMember.name}</div>
                      <small className="text-muted">{familyMember.relationship}</small>
                      {familyMember.profession && (
                        <small className="text-muted d-block">{familyMember.profession}</small>
                      )}
                    </div>
                  </div>
                  <div className="d-flex gap-1">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => editFamilyMember(familyMember)}
                      className="rounded-pill"
                      title="Edit"
                    >
                      <IconWrapper icon={FaPenToSquare} style={{ fontSize: '10px' }} />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => removeFamilyMember(familyMember.id)}
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
        </div>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <div>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold text-dark">
                  <IconWrapper icon={FaLinkedin} className="me-2" style={{ color: '#0066CC' }} />
                  LinkedIn URL
                </Form.Label>
                <Form.Control
                  type="url"
                  value={formData.personalDetails.socialMedia.linkedin}
                  onChange={(e) => setFormData({
                    ...formData, 
                    personalDetails: {
                      ...formData.personalDetails, 
                      socialMedia: {...formData.personalDetails.socialMedia, linkedin: e.target.value}
                    }
                  })}
                  placeholder="https://linkedin.com/in/username"
                  className="admin-form-control"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold text-dark">
                  <IconWrapper icon={FaFacebook} className="me-2" style={{ color: '#0066CC' }} />
                  Facebook URL
                </Form.Label>
                <Form.Control
                  type="url"
                  value={formData.personalDetails.socialMedia.facebook}
                  onChange={(e) => setFormData({
                    ...formData, 
                    personalDetails: {
                      ...formData.personalDetails, 
                      socialMedia: {...formData.personalDetails.socialMedia, facebook: e.target.value}
                    }
                  })}
                  placeholder="https://facebook.com/username"
                  className="admin-form-control"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold text-dark">
                  <IconWrapper icon={FaTwitter} className="me-2" style={{ color: '#0066CC' }} />
                  Twitter URL
                </Form.Label>
                <Form.Control
                  type="url"
                  value={formData.personalDetails.socialMedia.twitter}
                  onChange={(e) => setFormData({
                    ...formData, 
                    personalDetails: {
                      ...formData.personalDetails, 
                      socialMedia: {...formData.personalDetails.socialMedia, twitter: e.target.value}
                    }
                  })}
                  placeholder="https://twitter.com/username"
                  className="admin-form-control"
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Admin; 